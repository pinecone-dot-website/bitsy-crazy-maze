/**
 * Items
 * These are the item the player picks up along the way
 * SHorter dialog
 */

const item_tiles = [ 0, 1, 2, 3 ];
const markov = require( './markov.js' );

module.exports = {
    /**
     * 
     */
    populate_dialogs: function() {
        item_tiles.forEach( ( e, i ) => {
            let id = `ITM_${i}`;
            let text = markov.item().generate().cm_trim();

            window.dialog[ id ] = text;
            window.scriptInterpreter.Compile( id, text );

            //console.log( 'populate_item_dialogs', id, dialog[ id ] );
        } );
    },

    /**
     * 
     */
    position: function( _cur_room, room_offset ) {
        let threshold = .5;

        item_tiles.forEach( ( tile, i ) => {
            if ( Math.random() > threshold ) {
                x = ( ( Math.random() * 4 ).toFixed() * 2 ) + room_offset.x;
                y = ( ( Math.random() * 4 ).toFixed() * 2 ) + room_offset.y;

                room[ _cur_room ].items.push( {
                    id: i,
                    x: x,
                    y: y
                } );
            }
        });
    }
}