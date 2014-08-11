{
    "targets": [
        {
            "target_name": "clipper",
            "sources": [ "clipperinit.cc", "./src/clipper.cpp", "./lib/ClipperWrap.cpp" ],
            "cflags!": [ "-fno-exceptions" ],
            "cflags_cc!": [ "-fno-exceptions" ],
            'conditions': [
                ['OS=="mac"', {
                  'xcode_settings': {
                    'GCC_ENABLE_CPP_EXCEPTIONS': 'YES'
                  }
                }]
              ]
        }
    ]
}