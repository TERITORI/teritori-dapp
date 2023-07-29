require 'xcodeproj'

project_path = '../ios/teritori.xcodeproj'
target_name = 'teritori'
frameworks_to_add = ['CoreBluetooth.framework', 'MultipeerConnectivity.framework', "libresolv.tbd"]

project = Xcodeproj::Project.open(project_path)
target = project.targets.find { |t| t.name == target_name }

frameworks_to_add.each do |framework_name|
  framework_ref = project.frameworks_group.new_reference("System/Library/Frameworks/#{framework_name}")
  target.frameworks_build_phases.add_file_reference(framework_ref)
end

project.save