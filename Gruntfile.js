module.exports = function(grunt) {
  [ 'grunt-contrib-coffee',
    'grunt-contrib-sass',
    'grunt-contrib-watch' ].forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    coffee: {
      compile: {
        // 1:1 mapping through globs
        expand: true,
        flatten: true,
        cwd: 'src/',
        src: ['*.coffee'],
        dest: 'lib/',
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
          'styles/main.css': 'styles/main.scss'
        }
      }
    },

    coffee_concat: {
      compile: {
        options: {
          sourceMap: true
        },
        files: {
           // compile and concat into single file
          'lib/main.js': ['src/*.coffee']
        }
      },
    },

    watch: {
      js: {
        files: 'src/*.coffee',
        tasks: ['dev']
      }
    }
  });

  grunt.registerTask('dev', [ 'coffee:compile', 'sass' ]);
};
