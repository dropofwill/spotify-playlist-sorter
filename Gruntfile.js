module.exports = function(grunt) {
  [ 'grunt-contrib-coffee',
    'grunt-coffeeify',
    'grunt-contrib-sass',
    'grunt-contrib-watch' ].forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    // Merge all frontend coffeescript and javascript together into one main.js
    coffeeify: {
      compile: {
        options: {
          debug: true
        },
        files: [{
          // compile and concat into single file
          src: ['front/coffee/*.coffee'],
          dest: 'front/js/main.js'
        }]
      },
    },

    // 1:1 mapping from coffee to js
    coffee: {
      backend: {
        expand: true,
        flatten: true,
        cwd: 'back/src/',
        src: ['*.coffee'],
        dest: 'back/lib/',
        ext: '.js',
        options: {
          sourceMap: true
        }
      },

      frontend: {
        expand: true,
        flatten: true,
        cwd: 'front/coffee/',
        src: ['*.coffee'],
        dest: 'front/js/',
        ext: '.js',
        options: {
          sourceMap: true
        }
      }
    },

    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          'front/styles/main.css': 'front/styles/main.scss'
        }
      }
    },

    watch: {
      js: {
        files: ['back/src/*.coffee', 'front/coffee/*.coffee', 'front/styles/*.scss'],
        tasks: ['dev']
      }
    }
  });

  grunt.registerTask('dev', [ 'coffee:backend', 'coffee:frontend', 'sass' ]);
};
