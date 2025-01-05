import { program } from "commander";
import path from "path";
import process from "process"
import fs from "fs"
import open from "open"

const main = async () => {
    program.argument("<screen-name>");
    program.argument("<screen-slug>");
    program.parse();
    const [screenName, screenSlug] = program.args;

    const screenDir = path.join(__dirname, "..", "screens", screenName)
    if (fs.existsSync(screenDir)) {
        console.error("Screen", screenName, "already exists")
        process.exit(1)
    }
    fs.mkdirSync(screenDir, { recursive: true })

    const screenFilepath = path.join(screenDir, `${screenName}Screen.tsx`)
    const screenSrc = genScreenSrc(screenName)
    fs.writeFileSync(screenFilepath, screenSrc)

    const navigationFilepath = path.join(__dirname, "..", "utils", "navigation.ts")

    const propsLine = `  ${screenName}: undefined;`
    insertLineBeforeMarker(navigationFilepath, "__insert_screen_props_before_me__", propsLine)

    const slugLine = `      ${screenName}: "${screenSlug}"`
    insertLineBeforeMarker(navigationFilepath, "__insert_screen_nav_before_me__", slugLine)

    const navigatorFilepath = path.join(__dirname, "..", "components", "navigation", "getNormalModeScreens.tsx")

    const importLine = `import { ${screenName}Screen } from "@/screens/${screenName}/${screenName}Screen"`
    insertLineBeforeMarker(navigatorFilepath, "__insert_screen_import_before_me__", importLine)

    const screenComponent = `      <Nav.Screen
            name="${screenName}"
            component={${screenName}Screen}
            options={{ header: () => null, title: screenTitle("${screenName}") }}
          />`
    insertLineBeforeMarker(navigatorFilepath, "__insert_screen_before_me__", screenComponent)

    setTimeout(async () => {
        await open(`http://localhost:8081/${screenSlug}`)
        await open(`file://${path.resolve(screenFilepath)}`)
    }, 1000)
}

function insertLineBeforeMarker(filepath: string, marker: string, content: string) {
    let src = fs.readFileSync(filepath, { encoding: "utf-8" })
    const markerIdx = src.indexOf(marker)
    if (markerIdx == -1) {
        console.error(`Marker ${marker} not found in file at ${filepath}`)
        process.exit(1)
    }
    const lineEndIdx = src.lastIndexOf("\n", markerIdx)
    if (lineEndIdx == -1) {
        console.error(`Line return before marker ${marker} not found in file at ${filepath}`)
        process.exit(1)
    }
    const insertIdx = lineEndIdx + 1
    src = src.substring(0, insertIdx) + content + "\n" + src.substring(insertIdx)
    fs.writeFileSync(filepath, src)
}

function genScreenSrc(screenName: string) {
    return `import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { ScreenFC } from "@/utils/navigation";

export const ${screenName}Screen: ScreenFC<"${screenName}"> = () => {
  return (
    <ScreenContainer fullWidth>
      <BrandText>${screenName}</BrandText>
    </ScreenContainer>
  );
};
`
}

main()