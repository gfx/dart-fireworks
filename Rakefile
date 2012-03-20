
task :default => ["Fireworks.dart.js"];

rule "Fireworks.dart.js" => ["Fireworks.dart"] do |task|
    sh "frogc", "--verbose", "--checked", "--out=#{task.name}", task.source;
end

