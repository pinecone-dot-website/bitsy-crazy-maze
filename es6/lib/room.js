"use strict";

const generator = require( 'generate-maze' ),
    tiles = require( './tiles.js' );

module.exports = {
    /**
     * draws the border around the outermost walls
     */
    draw_border: function( _cur_room ) {
        for ( let i = 0; i < 16; i++ ) {
            room[ _cur_room ].tilemap[ 0 ][ i ] = tiles.get_wall();
            room[ _cur_room ].tilemap[ 15 ][ i ] = tiles.get_wall();

            room[ _cur_room ].tilemap[ i ][ 0 ] = tiles.get_wall();
            room[ _cur_room ].tilemap[ i ][ 15 ] = tiles.get_wall();
        }
    },

    /**
     * 
     */
    draw_map: function( _cur_room, room_offset ) {
        // the map
        let map_gen = generator( 7 );

        map_gen.map( ( row, _y ) => {
            row.map( ( tile, _x ) => {
                let x = ( _x * 2 ) + room_offset.x;
                let y = ( _y * 2 ) + room_offset.y;

                room[ _cur_room ].tilemap[ y ][ x ] = tiles.get_path();

                room[ _cur_room ].tilemap[ y - 1 ][ x ] = tile.top ? tiles.get_wall() : tiles.get_path();
                room[ _cur_room ].tilemap[ y + 1 ][ x ] = tile.bottom ? tiles.get_wall() : tiles.get_path();
                room[ _cur_room ].tilemap[ y ][ x - 1 ] = tile.left ? tiles.get_wall() : tiles.get_path();
                room[ _cur_room ].tilemap[ y ][ x + 1 ] = tile.right ? tiles.get_wall() : tiles.get_path();

                // 
                room[ _cur_room ].tilemap[ y - 1 ][ x - 1 ] = tiles.get_wall();
                room[ _cur_room ].tilemap[ y + 1 ][ x + 1 ] = tiles.get_wall();
                room[ _cur_room ].tilemap[ y - 1 ][ x + 1 ] = tiles.get_wall();
                room[ _cur_room ].tilemap[ y + 1 ][ x - 1 ] = tiles.get_wall();
            } );
        } );
    },

    /**
     * 
     */
    position_exits: function( _cur_room, room_offset ) {
        let x, y;

        // reset items on new map creation
        room[ _cur_room ].items = [];

        if ( _cur_room == "0" ) {
            x = 12 + room_offset.x;
            y = 12 + room_offset.y;
            room[ _cur_room ].tilemap[ y ][ x ] = "g";
        } else {
            x = room_offset.x;
            y = room_offset.y;
            room[ _cur_room ].tilemap[ y ][ x ] = "g";
        }

        //alert(x+' : '+y);

        room[ _cur_room ].exits[ 0 ].x = x;
        room[ _cur_room ].exits[ 0 ].y = y;

        // show item for door
        room[ _cur_room ].items.push( {
            id: 4,
            x: x,
            y: y
        } );
    }
}