module.exports = function(grunt) {

	grunt.initConfig({
		'min': {
			'dist': {
				'options': {
					'report': 'gzip'
				},
				'files': [{
					'src': 'totem-pole.js',
					'dest': 'totem-pole.min.js'
				}]
			}
		},
		'cssmin': {
			'dist': {
				'options': {
					'report': false
				},
				'files': [{
					'src': 'examples/example.css',
					'dest': 'examples/example.min.css'
				}]
			}
		},
		'lint': {
			'files': ['gruntFile.js', 'tasks/*.js', 'tasks/lib/*.js']
		},
	    'watch': {
			src: {
				files: ['/*'],
				tasks: ['min']
			}
	    },
		'jshint': {
			'all': ['totem-pole.js'],
			'options': {
				'curly': true,
				'immed': true,
				'latedef': true,
				'newcap': true,
				'noarg': true,
				'undef': true,
				'boss': true,
				'eqnull': true,
				'node': true,
				'es5': true,
				'trailing': true,
				'smarttabs': true
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-yui-compressor');

	grunt.loadTasks('tasks');

	grunt.registerTask('default', [
		'min', 'watch'
	]);

};
