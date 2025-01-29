
package daocond
import (
	"testing"
	"fmt"
)



func TestComputeVotingPowers(t *testing.T){
	type govDaoComposition struct {
		t1s int
		t2s int
		t3s int
	}
	tests:= map[string]govDaoComposition{
		"example 1": {
			t1s: 100,
			t2s: 100,
			t3s: 100,
		}
	}

	for name,composition range tests{
		t.run(name, func(t *testing.T){
			dao := newMockDAO()
			for idx:= range t1s{
				dao.addUser(fmt.Sprint(idx)+"_T1")
			}
			for idx:= range t2s{
				dao.addUser(fmt.Sprint(idx)+"_T2")
			}
			for idx:= range t3s{
				dao.addUser(fmt.Sprint(idx)+"_T3")
			}
		})
	}
	/*Example 1:
	T1 100 members --> 300 VP, 3 votes per member
	T2 100 members --> 200 VP, 2 votes per member
	T3 100 members --> 100 VP, 1 votes per member
	Example 2:

	T1 100 members --> 300 VP, 3 votes per member
	T2 50 members --> 100 VP, 2 votes per member *
	T3 10 members --> 10 VP, 1 votes per member *
	Example 3:

	T1 100 members --> 300 VP, 3 votes per member
	T2 200 members --> 200 VP, 1 votes per member *
	T3 100 members --> 100 VP, 1 votes per member
	Example 4:

	T1 100 members --> 300 VP, 3 votes per member
	T2 200 members --> 200 VP, 1 votes per member *
	T3 1000 members --> 100 VP, 0.1 votes per member */
	
}