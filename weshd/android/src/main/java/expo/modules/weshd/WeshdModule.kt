package expo.modules.weshd
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import com.weshnet.wesh.Wesh
import java.io.File
import android.content.Context
import expo.modules.kotlin.exception.Exceptions
import android.util.Log
import expo.modules.core.Promise

import java.net.InetAddress
import java.net.NetworkInterface

fun interfaceAddrs(): List<String> {
    val interfaceAddresses = mutableListOf<String>()
    try {
        val interfaces = NetworkInterface.getNetworkInterfaces()
        while (interfaces.hasMoreElements()) {
            val intf = interfaces.nextElement()
            val addresses = intf.inetAddresses
            while (addresses.hasMoreElements()) {
                val addr = addresses.nextElement()
                val formattedAddress = formatAddress(addr)
                if (formattedAddress != null) {
                    interfaceAddresses.add(formattedAddress)
                }
            }
        }
    } catch (e: Exception) {
        e.printStackTrace()
    }
    return interfaceAddresses
}

fun formatAddress(addr: InetAddress): String? {
    
    if (addr.isAnyLocalAddress || addr.isLoopbackAddress || addr.isLinkLocalAddress) {
         
        return null
    }

    return "/${addr.hostAddress}"
}


class WeshdModule: Module() {

  val context: Context
  get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()



fun getAbsolutePathForWeshDir(context: Context): String {
    try {
         
        val appSpecificDir = context.filesDir

        
        val weshDirPath = File(appSpecificDir, "wesh-dir")

        
        if (!weshDirPath.exists()) {
            weshDirPath.mkdirs()
        }

         
        val absolutePath = weshDirPath.absolutePath

        
        Log.i("WeshDirInfo", "Absolute path for wesh-dir: $absolutePath")

        return absolutePath
    } catch (e: Exception) {
        
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

     
    Function("boot") {  ->

      val absolutePath = getAbsolutePathForWeshDir(context)
      val addresses = interfaceAddrs()
      val joinedAaddresses = addresses.joinToString(separator = ",")
      Wesh.setMultiAddrs(joinedAaddresses)
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
