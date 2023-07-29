Pod::Spec.new do |s|
    s.name           = 'WeshFramework'
    s.version        = '1.0.0'
    s.summary        = 'A sample project summary'
    s.description    = 'A sample project description'
    s.author         = ''
    s.homepage       = 'https://docs.expo.dev/modules/'
    s.platform       = :ios, '13.0'
    s.source         = { path: './WeshFramework.xcframework' }
    s.static_framework = true
  
    s.vendored_frameworks = 'WeshFramework.xcframework'

    # Swift/Objective-C compatibility
    s.pod_target_xcconfig = {
      'DEFINES_MODULE' => 'YES',
      'SWIFT_COMPILATION_MODE' => 'wholemodule'
    }
    
    s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
  end
  