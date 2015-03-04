module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            styles: {
                options: {
                    style: 'expanded',
                    sourcemap:'none'
                },
                files: [{
                    expand: true,
                    cwd: '..',
                    src: ['*.scss'],
                    dest: '..',
                    ext: '.css'
                }]
            }
        },
        watch: {
            scripts: {
                files: ['../*.scss'],
                tasks: ['sass']
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('debug', ['watch']);
};