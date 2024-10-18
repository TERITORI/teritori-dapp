package notablecontribution

import (
  "std"
  "errors"
  "gno.land/p/demo/avl"
  "gno.land/p/demo/gnorkle/gnorkle"
  "gno.land/p/demo/gnorkle/message"
  "gno.land/p/demo/gnorkle/feeds/static"
)

type UserType string
type NotableContributionType string

type User struct {
 ID string
 Type UserType
}

func (u *User) JSON() (string) {
  return `{"ID":"` + u.ID + `","Type":"` + string(u.Type) + `"}`
}

func (u *User) String() string {
  return u.ID + ":" + string(u.Type)
}

type NotableContribution struct {
  ID string
  Type NotableContributionType 
  Description string
  URL string
  Date string
}

func (n *NotableContribution) JSON() (string) {
  return `{"ID":"` + string(n.ID) + `", "Type":"` + string(n.Type) + `","Description":"` + n.Description + `","URL":"` + n.URL + `","Date":"` + n.Date + `"}`
}

type NotableContributions []NotableContribution

func (n *NotableContributions) JSON() string {
  var result string
  for _, nc := range *n {
    result += nc.JSON() + ","
  }
  return "[" + result[:len(result)-1] + "]"
}

const (
  // User types
  UserTypeUser UserType = "address"
  UserGithub UserType = "github"

  // Notable contribution types
  NotableContributionTypeCommit NotableContributionType = "commit"
  NotableContributionTypeIssue NotableContributionType = "issue"
  NotableContributionTypePR NotableContributionType = "pr"
  NotableContributionTypeReview NotableContributionType = "review"
  NotableContributionTypeComment NotableContributionType = "comment"

  verifiedResult string = "OK"
)

var (
  postHandler  postGnorkleMessageHandler
  ownerAddress = std.GetOrigCaller()
  userContributions *avl.Tree
  oracle *gnorkle.Instance
)

func init()  {
  oracle = gnorkle.NewInstance()
	oracle.AddToWhitelist("", []string{string(ownerAddress)})
  userContributions = avl.NewTree()
}

type postGnorkleMessageHandler struct{}

// Handle implements the gnorkle.MessageHandler interface.
func (h postGnorkleMessageHandler) Handle(i *gnorkle.Instance, funcType message.FuncType, feed gnorkle.Feed) error {
	if funcType != message.FuncTypeIngest {
		return nil
	}

	result, _, consumable := feed.Value()
	if !consumable {
		return nil
	}

	defer oracle.RemoveFeed(feed.ID())

	// Couldn't verify; nothing to do.
	if result.String != verifiedResult {
		return nil
	}

	feedTasks := feed.Tasks()
	if len(feedTasks) != 1 {
		return errors.New("expected feed to have exactly one task")
	}

	task, ok := feedTasks[0].(*verificationTask)
	if !ok {
		return errors.New("expected task to be of type *verificationTask")
	}

  contributions := NotableContributions{}
  res, ok := userContributions.Get(task.user.String())
  if ok {
    contributions = res.(NotableContributions)
  }

  contributions = append(contributions, task.notablecontribution)
	userContributions.Set(task.user.String(), contributions)

	return nil
}

func RequestNotableContribution(userID string, userType UserType, ntID string,  ntType NotableContributionType, description, url, date string) {
  user := User{ID: userID, Type: userType}
  nt := NotableContribution{
    ID: ntID,
    Type: ntType, Description: description, URL: url, Date: date}

  vt := &verificationTask{
    user: user,
    notablecontribution: nt,
  }
  if err := oracle.AddFeeds(
    static.NewSingleValueFeed(
      vt.ID(),
      "string",
      vt,
    ),
  ); err != nil {
    panic(err)
  }
}

func GnorkleEntrypoint(message string) string {
	result, err := oracle.HandleMessage(message, postHandler)
	if err != nil {
		panic(err)
	}

	return result
}

// SetOwner transfers ownership of the contract to the given address.
func SetOwner(owner std.Address) {
	if ownerAddress != std.GetOrigCaller() {
		panic("only the owner can set a new owner")
	}

	ownerAddress = owner

	// In the context of this contract, the owner is the only one that can
	// add new feeds to the oracle.
	oracle.ClearWhitelist("")
	oracle.AddToWhitelist("", []string{string(ownerAddress)})
}

func GetUserContributions(userID, userType string) NotableContributions {
  contributions, ok := userContributions.Get(userID + ":" + userType)
  if !ok {
    return NotableContributions{}
  }
  return contributions.(NotableContributions)
}

func Render(path string) string {
  result := ``
  userContributions.Iterate("", "", func(user string, ctInf interface{}) bool {
    contributions := ctInf.(NotableContributions)
    result += `"`+ user + `":` + contributions.JSON() + `,`
    return true
  })

  length := len(result)
  if length == 0 {
    return `{}`
  }

  return `{` +result[:len(result)-1] + "}"
}
