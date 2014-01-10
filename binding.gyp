{
	"targets": [
		{
			"target_name": "clipper",
			"sources": [ "clipperinit.cc" ],
		    "cflags!": [ "-fno-exceptions" ],
			"cflags_cc!": [ "-fno-exceptions" ]
		}
	]
}