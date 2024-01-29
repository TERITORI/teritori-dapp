package expo.modules.weshd
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import com.weshnet.wesh.Wesh
import java.io.File
import android.content.Context
import expo.modules.kotlin.exception.Exceptions
import android.util.Log
import expo.modules.core.Promise




class WeshdModule: Module() {

  val context: Context
  get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()



fun getAbsolutePathForWeshDir(context: Context): String {
    try {
        // Get the app-specific directory
        val appSpecificDir = context.filesDir

        // Append "wesh-dir" to the path
        val weshDirPath = File(appSpecificDir, "wesh-dir")

        // Ensure the directory exists, create it if needed
        if (!weshDirPath.exists()) {
            weshDirPath.mkdirs()
        }

        // Get the absolute path
        val absolutePath = weshDirPath.absolutePath

        // Log the absolute path
        Log.i("WeshDirInfo", "Absolute path for wesh-dir: $absolutePath")

        return absolutePath
    } catch (e: Exception) {
        // Log the error and the path
        Log.e("WeshDirError", "Error getting absolute path for wesh-dir", e)
        return ""  // Return an empty string or handle the error accordingly
    }
}

  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('Weshd')` in JavaScript.
    Name("Weshd")

    // Sets constant properties on the module. Can take a dictionary or a closure that returns a dictionary.
    Constants(
      "PI" to Math.PI
    )

    // Defines event names that the module can send to JavaScript.
    Events("onChange")

    // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
    Function("boot") {  ->

          val absolutePath = getAbsolutePathForWeshDir(context)
          Wesh.boot(absolutePath)
      
    }

    AsyncFunction("getPort") {   ->
     return@AsyncFunction Wesh.getPort()
    }

    // Defines a JavaScript function that always returns a Promise and whose native code
    // is by default dispatched on the different thread than the JavaScript runtime runs on.
    AsyncFunction("setValueAsync") { value: String ->
      // Send an event to JavaScript.
      sendEvent("onChange", mapOf(
        "value" to value
      ))
    }

    // Enables the module to be used as a native view. Definition components that are accepted as part of
    // the view definition: Prop, Events.
    View(WeshdView::class) {
      // Defines a setter for the `name` prop.
      Prop("name") { view: WeshdView, prop: String ->
        println(prop)
      }
    }
  }
}
