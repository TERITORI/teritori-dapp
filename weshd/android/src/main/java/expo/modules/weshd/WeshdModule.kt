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

    // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
    Function("boot") {  ->

      val absolutePath = getAbsolutePathForWeshDir(context)
      Wesh.boot(absolutePath)
      
    }

    Function("shutdown") {  ->
      Wesh.shutdown()
    }

    AsyncFunction("getPort") {   ->
     return@AsyncFunction Wesh.getPort()
    }
  }
}
