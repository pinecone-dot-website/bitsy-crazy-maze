// https://www.npmjs.com/package/generate-maze

let generator = require( 'generate-maze' ),
    markov = require( 'markov-chain-js/src/markov-chain' );

// offset for tiles, 1 or 2
let room_offset = {
    x: Math.round( Math.random() ) + 1,
    y: Math.round( Math.random() ) + 1
};

// compared with global curRoom var
let _maze_room = null;

/**
 * 
 */
function position_exits() {
    if ( _maze_room == "0" ) {
        x = 12 + room_offset.x;
        y = 12 + room_offset.y;
        room[ _maze_room ].tilemap[ y ][ x ] = "g";
    } else {
        x = room_offset.x;
        y = room_offset.y;
        room[ _maze_room ].tilemap[ y ][ x ] = "g";
    }

    room[ _maze_room ].exits[ 0 ].x = x;
    room[ _maze_room ].exits[ 0 ].y = y;

    // show item for door
    room[ _maze_room ].items.push( {
        id: 4,
        x: x,
        y: y
    } );
}

/**
 * 
 */
function position_items() {
    room[ _maze_room ].items = [];

    for ( var i = 0; i <= 3; i++ ) {
        x = ( ( Math.random() * 4 ).toFixed() * 2 ) + room_offset.x;
        y = ( ( Math.random() * 4 ).toFixed() * 2 ) + room_offset.y;

        room[ _maze_room ].items.push( {
            id: i,
            x: x,
            y: y
        } );
    }
}

/**
 * 
 */
function position_player() {
    if ( _maze_room == "0" ) {
        player().x = room_offset.x;
        player().y = room_offset.y;
    } else {
        player().x = 12 + room_offset.x;
        player().y = 12 + room_offset.y;
    }

}

/**
 * 
 */
function position_sprites() {
    x = ( ( Math.random() * 4 ).toFixed() * 2 ) + room_offset.x + 1;
    y = ( ( Math.random() * 4 ).toFixed() * 2 ) + room_offset.y + 1;

    sprite.b.room = _maze_room;
    sprite.b.x = x;
    sprite.b.y = y;
}

/**
 * make map tiles
 */
function position_tilemap() {
    // border
    for ( let i = 0; i < 16; i++ ) {
        room[ _maze_room ].tilemap[ 0 ][ i ] = get_wall_tile();
        room[ _maze_room ].tilemap[ 15 ][ i ] = get_wall_tile();

        room[ _maze_room ].tilemap[ i ][ 0 ] = get_wall_tile();
        room[ _maze_room ].tilemap[ i ][ 15 ] = get_wall_tile();
    }

    // the map
    let map_gen = generator( 7 );

    map_gen.map( ( row, _y ) => {
        row.map( ( tile, _x ) => {
            let x = ( _x * 2 ) + room_offset.x;
            let y = ( _y * 2 ) + room_offset.y;

            room[ _maze_room ].tilemap[ y ][ x ] = get_path_tile();

            room[ _maze_room ].tilemap[ y - 1 ][ x ] = tile.top ? get_wall_tile() : get_path_tile();
            room[ _maze_room ].tilemap[ y + 1 ][ x ] = tile.bottom ? get_wall_tile() : get_path_tile();
            room[ _maze_room ].tilemap[ y ][ x - 1 ] = tile.left ? get_wall_tile() : get_path_tile();
            room[ _maze_room ].tilemap[ y ][ x + 1 ] = tile.right ? get_wall_tile() : get_path_tile();

            // 
            room[ _maze_room ].tilemap[ y - 1 ][ x - 1 ] = get_wall_tile();
            room[ _maze_room ].tilemap[ y + 1 ][ x + 1 ] = get_wall_tile();
            room[ _maze_room ].tilemap[ y - 1 ][ x + 1 ] = get_wall_tile();
            room[ _maze_room ].tilemap[ y + 1 ][ x - 1 ] = get_wall_tile();
        } );
    } );
}

/**
 * 
 */
function on_interval() {
    // sanity check
    if ( !room[ _maze_room ] )
        return;

    // pause updater
    clearInterval( update_interval );

    room_offset = {
        x: Math.round( Math.random() ) + 1,
        y: Math.round( Math.random() ) + 1
    };

    // make map tiles
    position_tilemap();

    // setup items to collect
    position_items();

    // setup sprite
    position_sprites();

    // setup exits
    position_exits();

    //
    position_player();

    // restart updater
    update_interval = setInterval( update, -1 );

    // happens after interval starts again
    populate_item_dialogs();
    populate_sprite_dialogs();
}
window.on_interval = on_interval;

/**
 * gets random path tile
 * @return string 
 */
function get_path_tile() {
    let i = Math.floor( Math.random() * 3 );

    return [ 'd', 'e', 'f' ][ i ];
}
window.get_path_tile = get_path_tile;

/**
 * gets random wall tile
 * @return string 
 */
function get_wall_tile() {
    let i = Math.floor( Math.random() * 3 );

    return [ 'a', 'b', 'c' ][ i ];
}

/**
 * 
 */
function populate_item_dialogs() {
    for ( var i = 0; i <= 3; i++ ) {
        let id = `ITM_${i}`;
        let text = trim_text( mkv_item.generate() );
        dialog[ id ] = text;

        scriptInterpreter.Compile( id, text );

        console.log( 'populate_item_dialogs', id, dialog[ id ] );
    }
}
window.populate_item_dialogs = populate_item_dialogs;

/**
 * 
 */
function populate_sprite_dialogs() {
    for ( var i = 1; i <= 1; i++ ) {
        let id = `SPR_${i}`;
        let text = mkv_sprite.generate();
        dialog[ id ] = text;

        scriptInterpreter.Compile( id, text );

        //responsiveVoice.speak( text );

        console.log( 'populate_sprite_dialogs', id, dialog[ id ] );
    }
}
window.populate_sprite_dialogs = populate_sprite_dialogs;

/**
 * https://stackoverflow.com/a/17767051
 * @param
 * @return string
 */
function trim_text( raw_text ) {
    var arry = raw_text.split( /([.!?])\s/ );
    var sentences = [];

    for ( let i = 0; i < arry.length; i += 2 ) {
        // In case the last sentence is not delimited
        if ( i < arry.length - 1 ) {
            sentences.push( arry[ i ] + arry[ i + 1 ] );
        } else {
            sentences.push( arry[ i ] );
        }
    }

    //console.log( 'trim_text raw_text:', raw_text );
    //console.log( 'trim_text sentences:', sentences );

    return sentences[ 0 ];
    //return sentences.join( ' --- ' );
}

setInterval( () => {
    if ( curRoom && ( _maze_room !== curRoom ) ) {
        _maze_room = curRoom;

        on_interval();
    }
}, 50 );

let markov_dialog = `The majority of games on this list mostly fall under the visual novel. People say that we're born with a purpose And that we're meant to make our dreams come true But if our dreams start to crumble they can bury us
Got to dig yourself out and push on through. They say that nobody changes But I'm living proof that they do Because I found the answer And you can find the answer too They made me think I was crazy
And that the pain was here to stay. I'll say it again in the land of the free Use your freedom of choice Your freedom of choice In ancient Rome There was a poem About a dog Who found two bones He picked at one He licked the other He went in circles He dropped dead Freedom of choice Is what you got Freedom of choice! Is what you want!
Then if you got it you don't want it Seems to be the rule of thumb Don't be tricked by what you see You got two ways to go But now that I found the answer I'm never ever gunna lose my way A winter's day, a bitter snowflake on my face My summer girl takes little backward steps away And I saw the multitude of faces, honest, rich and clean
As the merchandise exchanged and money roared. I'll sow my seeds with a metric grosse No footsteps go beyond it I'll eat the dirt Where the rooster crows Fresh rodeos, behold it Check your pulse in your teardrops Make you a cyclops Breakin' the branches off your family tree And a woman hot with worry slyly slipped a tin of stewing steak Into the paper bag at her side And her face was white with fear in case her actions were observed
So she closed her eyes to keep her conscience blind. My mind has changed my body's frame, but, God, I like it My heart's aflame, my body's strained, but, God, I like it My mind has changed my body's frame, but, God, I like it My heart's aflame, my body's strained, but, God, I like it Charge me your day rate I'll turn you out in kind When the moon is round and full Gonna teach you tricks that'll blow your Mongrel mind Then she moved toward the exit clutching tightly at her paper bag
Perspiration trickled down her forehead And her heart it leapt inside her as the hand laid on her shoulder She was led away bewildered and amazed Through her deafened ears the cash machines were shrieking on the counter
As her escort asked her softly for her name And a crowd of honest people rushed to help a tired old lady There's too much paranoias My momma's afraid to tell me The things she's afraid of I been dipped in double meaning
I been stuck with static cling. Think I got a rupto-pac I think I got a Big Mac attack. Hold the pickles, hold the lettuce Special orders, don't upset us All we ask is that you let us Serve it your way. Who had fainted to the whirling wooden floor. When, in the course of development, class distinctions have disappeared, 
and all production has been concentrated in the hands of a vast association of the whole nation, the public power will lose its political character. It makes itself the ruling class, and, as such, sweeps away by force the old conditions of production, then it will, along with these conditions, have swept away the conditions for the existence of class antagonisms and of classes generally, and will thereby have abolished its own supremacy as a class. 
I laughed and shook his hand, And made my way back home I searched for form and land, For years and years I roamed I gazed a gazely stare At all the millions here We must have died alone, A long-long time ago Modern Industry has converted the little workshop of the patriarchal master into the great factory of the industrial capitalist. Masses of labourers, crowded into the factory, are organised like soldiers. As privates of the industrial army they are placed under the command of a perfect hierarchy of officers and sergeants. 
They are daily and hourly enslaved by the machine, by the overlooker, and, above all, by the individual bourgeois manufacturer himself. The more openly this despotism proclaims gain to be its end and aim, the more petty, the more hateful and the more embittering it is.
The less the skill and exertion of strength implied in manual labour, in other words, the more modern industry becomes developed, the more is the labour of men superseded by that of women. Differences of age and sex have no longer any distinctive social validity for the working class. 
All are instruments of labour, more or less expensive to use, according to their age and sex.
No sooner is the exploitation of the labourer by the manufacturer, so far, at an end, that he receives his wages in cash, than he is set upon by the other portions of the bourgeoisie, the landlord, the shopkeeper, the pawnbroker, etc.
Your mouth is open wide The lover is inside And all the tumult's done. Collided with the sign You're staring at the sun You're standing in the sea Your body's over me Note the trees because the Dirt is temporary. More to mine than fact, face Name, and monetary
The lower strata of the middle class — the small tradespeople, shopkeepers, and retired tradesmen generally, the handicraftsmen and peasants — all these sink gradually into the proletariat, partly because their diminutive capital does not suffice for the scale on which Modern Industry is carried on, and is swamped in the competition with the large capitalists, partly because their specialised skill is rendered worthless by new methods of production. Thus the proletariat is recruited from all classes of the population.
Fly in retreat I would follow without shame A stupid spud staggering to the flame To be had and rehad We choose to go to the moon. We choose to go to the moon in this decade and do the other things, not because they are easy, but because they are hard, because that goal will serve to organize and measure the best of our energies and skills, because that challenge is one that we are willing to accept, one we are unwilling to postpone, and one which we intend to win, and the others, too.
Be a victim of the pain Now it's strange, it's so strange it's a strange pursuit I come running like a fatboy In lead shoes But like a fatboy Huff puffing after you It's hopeless to hope for The one thing that I'm wanting
'Cause it's strange It's so very strange The proletariat goes through various stages of development. At first the contest is carried on by individual labourers, then by the workpeople of a factory, then by the operative of one trade, in one locality, against the individual bourgeois who directly exploits them. They destroy imported wares that compete with their labour, they smash to pieces machinery, they set factories ablaze, they seek to restore by force the vanished status of the workman of the Middle Ages.
At this stage, the labourers still form an incoherent mass scattered over the whole country, and broken up by their mutual competition. If anywhere they unite to form more compact bodies, this is not yet the consequence of their own active union, but of the union of the bourgeoisie, which class, in order to attain its own political ends, is compelled to set the whole proletariat in motion, and is moreover yet, for a time, able to do so. At this stage, therefore, the proletarians do not fight their enemies, but the enemies of their enemies, the remnants of absolute monarchy, the landowners, the non-industrial bourgeois, the petty bourgeois. 
Thus, the whole historical movement is concentrated in the hands of the bourgeoisie; every victory so obtained is a victory for the bourgeoisie.
But with the development of industry, the proletariat not only increases in number; it becomes concentrated in greater masses, its strength grows, and it feels that strength more. The various interests and conditions of life within the ranks of the proletariat are more and more equalised, in proportion as machinery obliterates all distinctions of labour, and nearly everywhere reduces wages to the same low level. The growing competition among the bourgeois, and the resulting commercial crises, make the wages of the workers ever more fluctuating. The increasing improvement of machinery, ever more rapidly developing, makes their livelihood more and more precarious; the collisions between individual workmen and individual bourgeois take more and more the character of collisions between two classes. 
Thereupon, the workers begin to form combinations (Trades’ Unions) against the bourgeois; they club together in order to keep up the rate of wages; they found permanent associations in order to make provision beforehand for these occasional revolts. Here and there, the contest breaks out into riots. `;

let mkv_item = new markov( {
    max: 160,
    order: 3,
    source: markov_dialog
} );

let mkv_sprite = new markov( {
    max: 300,
    order: 3,
    source: markov_dialog
} );

//window.mkv = mkv;