import WeshFramework
import ExpoModulesCore


func getDocumentsDirectory() -> String {
    let paths = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)
    let documentsDirectory = paths[0]
    return documentsDirectory.appendingPathComponent("wesh-dir").path
}

public class WeshdModule: Module {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  public func definition() -> ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('Weshd')` in JavaScript.
    Name("Weshd")


    // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
    AsyncFunction("boot") {
      WeshFramework.WeshBoot(getDocumentsDirectory())
    }
    
    AsyncFunction("getPort") { () -> Int in
      return WeshFramework.WeshGetPort()
    }

    AsyncFunction("shutdown") {
      WeshFramework.WeshShutdown()
    }

  }
}
