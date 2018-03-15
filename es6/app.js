// https://www.npmjs.com/package/generate-maze
let items = require( './lib/items.js' ),
    room_ = require( './lib/room.js' ),
    sprites = require( './lib/sprites.js' ),
    tiles = require( './lib/tiles.js' );

// compared with global curRoom var
let _cur_room = null;

/**
 * 
 */
function interval_callback() {
    // sanity check
    if ( !room[ _cur_room ] ) {
        //alert( "_cur_room not set!?!? : "+JSON.stringify(_cur_room) );
        _cur_room = null;
        return;
    }

    // pause bitsy updater
    clearInterval( window.update_interval );

    // set new variables
    let room_offset = room_.generate_offset();
    room[ _cur_room ].room_offset = room_offset;

    if ( palette.hasOwnProperty( room[ _cur_room ].pal + 2 ) ) {
        room[ _cur_room ].pal += 2
    }

    // make map tiles and place exits
    room_.draw_map( _cur_room, room_offset );
    room_.position_exits( _cur_room, room_offset );
    room_.position_player( room_offset );

    // setup items to collect
    items.position( _cur_room, room_offset );

    // setup sprite
    sprites.position( _cur_room, room_offset );

    // restart bitsy updater
    window.update_interval = setInterval( update, -1 );

    // happens after interval starts again
    items.populate_dialogs();
    sprites.populate_dialogs();
}

/**
 * 
 */
function game_interval() {
    if ( _cur_room !== curRoom ) {
        _cur_room = curRoom;

        interval_callback();
    }
}

/**
 * 
 */
function bootstrap() {
    if ( curRoom && ( _cur_room !== curRoom ) ) {
        // run once stuff here
        room_.draw_border( 0 );
        room_.draw_border( 1 );
        room[ 0 ].room_offset = room_.generate_offset();

        // booo these are set as strings
        room[ 0 ].pal = 0;
        room[ 1 ].pal = 1;

        // set the real interval
        clearInterval( bootstrap_interval );
        setInterval( game_interval, 50 );
    }
}

let bootstrap_interval = setInterval( bootstrap, 50 );