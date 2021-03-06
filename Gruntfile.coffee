module.exports = ( grunt ) ->
  grunt.initConfig {
    pkg: grunt.file.readJSON "package.json"
    clean:
      [ "index.js" ]

    typescript:
      commonjs:
        src: [ "index.ts" ]
        dest: "index.js"
        options:
          module : "commonjs"
          target : "es5"
  }

  grunt.loadNpmTasks "grunt-contrib-clean"
  grunt.loadNpmTasks "grunt-typescript"

  grunt.registerTask "build", [
    "clean"
    "typescript"
  ]

