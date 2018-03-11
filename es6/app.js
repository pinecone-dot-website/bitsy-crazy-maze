// https://www.npmjs.com/package/generate-maze

var generator = require( 'generate-maze' ),
    markov = require('simple-markov');

window.generator = generator;
window.markov = markov;

console.log( 'generator', generator );
console.log( 'markov', markov );

let _maze_room = null;

/**
 * 
 */
function draw_map() {
    // pause updater
    clearInterval( update_interval );

    // make map tiles
    let map_gen = generator( 7 );
    map_gen.map( ( row, _y ) => {

        row.map( ( tile, _x ) => {
            //console.log( 'tile', tile );

            let x = ( _x * 2 ) + 1;
            let y = ( _y * 2 ) + 1;

            //console.log( x, y );
            room[ _maze_room ].tilemap[ y ][ x ] = "0"

            room[ _maze_room ].tilemap[ y - 1 ][ x ] = tile.top ? "a" : "0";
            room[ _maze_room ].tilemap[ y + 1 ][ x ] = tile.bottom ? "a" : "0";
            room[ _maze_room ].tilemap[ y ][ x - 1 ] = tile.left ? "a" : "0";
            room[ _maze_room ].tilemap[ y ][ x + 1 ] = tile.right ? "a" : "0";

            // 
            room[ _maze_room ].tilemap[ y - 1 ][ x - 1 ] = "a";
            room[ _maze_room ].tilemap[ y + 1 ][ x + 1 ] = "a";
            room[ _maze_room ].tilemap[ y - 1 ][ x + 1 ] = "a";
            room[ _maze_room ].tilemap[ y + 1 ][ x - 1 ] = "a";
        } );
    } );

    // setup items to collect
    room[ _maze_room ].items = [];
    for ( var i = 0; i <= 3; i++ ) {
        x = ( ( Math.random() * 4 ).toFixed() * 2 ) + 3;
        y = ( ( Math.random() * 4 ).toFixed() * 2 ) + 3;

        //console.log(i);

        room[ _maze_room ].items.push( {
            id: i,
            x: x,
            y: y
        } )

        let id = `ITM_${i}`;
        dialog[id] = mkv.generateText(50);
    }

    // setup exits
    if ( _maze_room == "0" ) {
        room[ _maze_room ].tilemap[ 13 ][ 13 ] = "b";
    } else {
        room[ _maze_room ].tilemap[ 1 ][ 1 ] = "b";
    }

    // restart updater
    update_interval = setInterval( update, -1 );
}
window.draw_map = draw_map;

setInterval( () => {
    if ( _maze_room !== curRoom ) {
        _maze_room = curRoom;

        draw_map();
    }
}, 10 );


let markov_text = `The majority of games on this list mostly fall under the visual novel (VN) and role-playing game (RPG) genres, due to their greater emphasis on storytelling and dialogues than other genres. 
I really like markov chains. They make generating text very hilarious.
These conversations can take the form of quests, hints or handoff conversations that introduce players to new characters and locations. Although dialogue can branch — and often will — depending on player choice, writers must be aware that only one nugget of information will move the player forward. Everything else must eventually fold back into that conclusion.
Other pitfalls in writing game dialogue include offer players what is essentially the same option, but simply reworded. According to Hepler, there are three options typically offered: one for the eager player, one for the "what's in it for me" player, and one for the "aggressive" player who wants to refuse but still take the option. Conversations that don't have a point or confuse players of their goal are also to be avoided.
And third, dialogue has to be as aware of the player’s actions as possible. "If you’ve just wiped out the Enclave, then you’d script the merchant’s opening node to something else: 'Hey, you’re the one that kicked the Enclave’s ass. Anything I have in stock; for you, half off.’"
Find a reasonable compromise between clarity and shortness. For example, I suggest to write "m" instead of "message", because that will be the most frequently used command ever, so making it short will make the text more legible. But there is no need to shorten the remaining keywords. (However, do as you wish. The important thing is to make it most legible for you. Alternatively, you could support both "m" and "message" as valid keywords.)`

let mkv = new markov(2, markov_text);

/*
//mkv.learn('We can keep making it learn, too.');
 
//console.log(mkv.generateText(50));
*/
