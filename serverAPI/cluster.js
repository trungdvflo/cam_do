var cluster = require( "cluster" );
var os = require( "os" );

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

if ( cluster.isMaster ) {

    console.log(  "[Cluster]" , "Master process is starting.", process.pid );
    
    for ( var i = 0, coreCount = os.cpus().length ; i < coreCount ; i++ ) {

        var worker = cluster.fork();

    }

    cluster.on(
        "exit",
        function handleExit( worker, code, signal ) {

            console.log( "[Cluster]" , "Worker is ended.", worker.process.pid );
            console.log( "[Cluster]" , "self create:", worker.exitedAfterDisconnect );
            if ( ! worker.exitedAfterDisconnect ) {
                var worker = cluster.fork();
            }

        }
    );

} else {
    require( "./index" );

    console.log("[Worker]", "Worker start.", process.pid );

}