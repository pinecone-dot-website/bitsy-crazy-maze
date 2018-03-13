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

//
const sprite_tiles = [ 'b', 'c', 'd' ];

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
    let threshold = .5;

    // reset
    room[ _maze_room ].items = [];

    for ( let i = 0; i <= 3; i++ ) {
        if ( Math.random() > threshold ) {
            x = ( ( Math.random() * 4 ).toFixed() * 2 ) + room_offset.x;
            y = ( ( Math.random() * 4 ).toFixed() * 2 ) + room_offset.y;

            room[ _maze_room ].items.push( {
                id: i,
                x: x,
                y: y
            } );
        }
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
    let threshold = .75;

    for ( let i = 0; i < sprite_tiles.length; i++ ) {
        let e = sprite_tiles[ i ];
        
        if ( Math.random() > threshold ) {
            x = ( ( Math.random() * 4 ).toFixed() * 2 ) + room_offset.x + 1;
            y = ( ( Math.random() * 4 ).toFixed() * 2 ) + room_offset.y + 1;

            sprite[ e ].room = _maze_room;
            sprite[ e ].x = x;
            sprite[ e ].y = y;
        } else {
            sprite[ e ].room = 100;
        }
    }
}
window.position_sprites = position_sprites;

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
    if ( !room[ _maze_room ] ){
        //alert( "_maze_room not set!?!? : "+JSON.stringify(_maze_room) );
        _maze_room = null;
        return;
    }

    // pause updater
    clearInterval( update_interval );

    // set new variables
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
    for ( let i = 1; i <= sprite_tiles.length; i++ ) {
        let id = `SPR_${i}`,
            text = mkv_sprite.generate();

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
Got to dig yourself out and push on through. They say that nobody changes But I'm living proof that they do Because I found the answer And you can find the answer too They made me think I was crazy And that the pain was here to stay. I'll say it again in the land of the free Use your freedom of choice Your freedom of choice In ancient Rome There was a poem About a dog Who found two bones He picked at one He licked the other He went in circles He dropped dead Freedom of choice Is what you got Freedom of choice! Is what you want! Then if you got it you don't want it Seems to be the rule of thumb Don't be tricked by what you see You got two ways to go But now that I found the answer I'm never ever gunna lose my way A winter's day, a bitter snowflake on my face My summer girl takes little backward steps away And I saw the multitude of faces, honest, rich and clean As the merchandise exchanged and money roared. I'll sow my seeds with a metric grosse No footsteps go beyond it I'll eat the dirt Where the rooster crows Fresh rodeos, behold it Check your pulse in your teardrops Make you a cyclops Breakin' the branches off your family tree And a woman hot with worry slyly slipped a tin of stewing steak Into the paper bag at her side And her face was white with fear in case her actions were observed
So she closed her eyes to keep her conscience blind. And for me it's the consequence of likeability; it's what that idea of likeability does. And I think instead we should teach girls to just be themselves, and that idea that you don't have to be liked by everyone. And it kind of makes me wonder what kind of world would we have lived in if women had been allowed to be their full selves? My mind has changed my body's frame, but, God, I like it My heart's aflame, my body's strained, but, God, I like it My mind has changed my body's frame, but, God, I like it My heart's aflame, my body's strained, but, God, I like it Charge me your day rate I'll turn you out in kind When the moon is round and full Gonna teach you tricks that'll blow your Mongrel mind Then she moved toward the exit clutching tightly at her paper bag
Perspiration trickled down her forehead And her heart it leapt inside her as the hand laid on her shoulder She was led away bewildered and amazed Through her deafened ears the cash machines were shrieking on the counter As her escort asked her softly for her name And a crowd of honest people rushed to help a tired old lady There's too much paranoias My momma's afraid to tell me The things she's afraid of I been dipped in double meaning I buy my own things, I pay my own bills.  These diamond rings, my automobiles. Everything I got, I bought it. I been stuck with static cling. Think I got a rupto-pac I think I got a Big Mac attack. Hold the pickles, hold the lettuce Special orders, don't upset us All we ask is that you let us Serve it your way. Who had fainted to the whirling wooden floor. When, in the course of development, class distinctions have disappeared, and all production has been concentrated in the hands of a vast association of the whole nation, the public power will lose its political character. It makes itself the ruling class, and, as such, sweeps away by force the old conditions of production, then it will, along with these conditions, have swept away the conditions for the existence of class antagonisms and of classes generally, and will thereby have abolished its own supremacy as a class. Across the tracks and the name of the place is you like it like that. 
You like it like that, you like it like that, you like it like that. I laughed and shook his hand, And made my way back home I searched for form and land, For years and years I roamed I gazed a gazely stare At all the millions here We must have died alone, A long-long time ago Modern Industry has converted the little workshop of the patriarchal master into the great factory of the industrial capitalist. Masses of labourers, crowded into the factory, are organised like soldiers. As privates of the industrial army they are placed under the command of a perfect hierarchy of officers and sergeants.  Her face was sad and lovely with bright things in it, bright eyes and a bright passionate mouth, but there was an excitement in her voice that men who had cared for her found difficult to forget: a singing compulsion, a whispered “Listen,” a promise that she had done gay, exciting things just a while since and that there were gay, exciting things hovering in the next hour.
They are daily and hourly enslaved by the machine, by the overlooker, and, above all, by the individual bourgeois manufacturer himself. The more openly this despotism proclaims gain to be its end and aim, the more petty, the more hateful and the more embittering it is. These canonical scriptures, first transmitted by Gautama Budda are also known as the “Great Treasury of Sutras”. They were written between the 2nd century BC and the 2nd century AD. The most vital Sutra is the Lotus Sutra which contains a sermon by Buddha to his followers, teaching them the basis of Buddhism. The word sutra itself means a thread or line that holds ends together (from which are also the English words “sew” and “suture” derived), for the books were initially written on palm leaves and sewn together with thread.
The less the skill and exertion of strength implied in manual labour, in other words, the more modern industry becomes developed, the more is the labour of men superseded by that of women. Differences of age and sex have no longer any distinctive social validity for the working class.  The shame we attach to female sexuality is about control. Many cultures and religions control women’s bodies in one way or the other. If the justification for controlling women’s bodies were about women themselves, then it would be understandable. If, for example, the reason was – women should not wear short skirts because they can get cancer if they do. Instead the reason is not about women, it is about men. Women must be ‘covered up’ to protect men. I find this deeply dehumanizing because it reduces women to mere props used to manage the appetites of men. All are instruments of labour, more or less expensive to use, according to their age and sex. No sooner is the exploitation of the labourer by the manufacturer, so far, at an end, that he receives his wages in cash, than he is set upon by the other portions of the bourgeoisie, the landlord, the shopkeeper, the pawnbroker, etc. Sometimes fate is like a small sandstorm that keeps changing directions. You change direction but the sandstorm chases you. You turn again, but the storm adjusts. Over and over you play this out, like some ominous dance with death just before dawn. Why? Because this storm isn’t something that blew in from far away, something that has nothing to do with you. This storm is you. Something inside of you. So all you can do is give in to it, step right inside the storm, closing your eyes and plugging up your ears so the sand doesn’t get in, and walk through it, step by step. 
There’s no sun there, no moon, no direction, no sense of time. Just fine white sand swirling up into the sky like pulverized bones. That’s the kind of sandstorm you need to imagine. And you really will have to make it through that violent, metaphysical, symbolic storm. No matter how metaphysical or symbolic it might be, make no mistake about it: it will cut through flesh like a thousand razor blades. People will bleed there, and you will bleed too. Hot, red blood. You’ll catch that blood in your hands, your own blood and the blood of others. I want to know if you can be with joy, mine or your own, if you can dance with wildness and let the ecstasy fill you to the tips of your fingers and toes without cautioning us to be careful, to be realistic, to remember the limitations of being human. Written around 380 BCE, this text is considered to be one of the most influential pieces ever written. The Republic observes justice in man and politics and discusses the role of the philosopher in society. 
Many of the intellectual concepts contained in The Republic are still discussed today, but the text is also an important historical document that provides historians with a snapshot of Greece at the time of its writing. And once the storm is over you won’t remember how you made it through, how you managed to survive. You won’t even be sure, in fact, whether the storm is really over. But one thing is certain. When you come out of the storm you won’t be the same person who walked in. That’s what this storm’s all about. You think because he doesn’t love you that you are worthless. You think that because he doesn’t want you anymore that he is right — that his judgement and opinion of you are correct. If he throws you out, then you are garbage. You think he belongs to you because you want to belong to him. Don’t. It’s a bad word, ‘belong.’ Especially when you put it with somebody you love. Love shouldn’t be like that. Did you ever see the way the clouds love a mountain? They circle all around it; sometimes you can’t even see the mountain for the clouds. 
But you know what? You go up top and what do you see? His head. The clouds never cover the head. His head pokes through, beacuse the clouds let him; they don’t wrap him up. They let him keep his head up high, free, with nothing to hide him or bind him. You can’t own a human being. You can’t lose what you don’t own. Suppose you did own him. Could you really love somebody who was absolutely nobody without you? You really want somebody like that? Somebody who falls apart when you walk out the door? You don’t, do you? And neither does he. You’re turning over your whole life to him. Your whole life, girl. And if it means so little to you that you can just give it away, hand it to him, then why should it mean any more to him? He can’t value you more than you value yourself. Written by the famed orator and former slave, Frederick Douglass, this narrative is considered the most famous of pieces written by former slaves and one of the most influential texts during the abolitionist movement in the United States. In the text, Douglass recounts his life as a slave on his way to freedom.
Your mouth is open wide The lover is inside And all the tumult's done. Collided with the sign You're staring at the sun You're standing in the sea Your body's over me Note the trees because the Dirt is temporary. More to mine than fact, face Name, and monetary. The 700-verse Bhagavad Gita was written in the 5th to 2nd century BC and is a part of the famous epic of Mahabharata. It is basically a call for selfless action which had a profound influence on several leaders of the Indian independence movement including Mohandas Gandhi. The great Indian leader called the Bhagavad Gita his “spiritual dictionary”. The text is a variation of the Upanishads in many aspects including its format and philosophy. However, Bhagavad Gita integrates dualism and theism, whereas the Upanishads are monotheistic.
The lower strata of the middle class — the small tradespeople, shopkeepers, and retired tradesmen generally, the handicraftsmen and peasants — all these sink gradually into the proletariat, partly because their diminutive capital does not suffice for the scale on which Modern Industry is carried on, and is swamped in the competition with the large capitalists, partly because their specialised skill is rendered worthless by new methods of production. Thus the proletariat is recruited from all classes of the population. The Rights of Man argues that political revolution is acceptable and permissible when a government fails to perform its duty of protecting the natural rights of its citizens. Written as a defense of the French Revolution, Paine’s 1791 book was widely circulated and challenged all societal institutions that don’t benefit the nation overall, including institutions such as monarchies and aristocracies. Fly in retreat I would follow without shame. I want your baby sister, give me your baby sister, dig your baby sister. Rise up on her knees, do the sweet pea, do the sweet pee pee. Roll down on her back, got to lose control. The Upanishads were probably composed in India between 800 BC and 100 BC and literally translate to “Sittings near, laying siege to a Teacher”. They are comprised of philosophical texts which form the theoretical basis for Hinduism. The scripture is composed of more than 200 texts though a mere 13 of them are considered primary teachings. Considered by Hindus to contain truths revealed to illustrate the nature of ultimate reality (Brahman), they also describe the very character and form of human salvation (moksha). Though unique from the Vedas, Hindus regard the Upanishads as an extension of the Vedas.
Got to lose control and then you take control. Then you're rolled down on your back and you like it like that. Like it like that, like it like that, like it like that. A stupid spud staggering to the flame To be had and rehad We choose to go to the moon. We choose to go to the moon in this decade and do the other things, not because they are easy, but because they are hard, because that goal will serve to organize and measure the best of our energies and skills, because that challenge is one that we are willing to accept, one we are unwilling to postpone, and one which we intend to win, and the others, too. We believe that we can change the things around us in accordance with our desires—we believe it because otherwise we can see no favourable outcome. 
We do not think of the outcome which generally comes to pass and is also favourable: we do not succeed in changing things in accordance with our desires, but gradually our desires change. The situation that we hoped to change because it was intolerable becomes unimportant to us. We have failed to surmount the obstacle, as we were absolutely determined to do, but life has taken us round it, led us beyond it, and then if we turn round to gaze into the distance of the past, we can barely see it, so imperceptible has it become. Be a victim of the pain Now it's strange, it's so strange it's a strange pursuit I come running like a fatboy In lead shoes But like a fatboy Huff puffing after you It's hopeless to hope for The one thing that I'm wanting 'Cause it's strange It's so very strange. The desire for comfortable protection instead of an intelligent curiosity & courage in meeting & resisting the pressure of life sex or so called love must be reduced to its initial element, honour, grief, sentimentality, pride and & consequently jealousy must be detached from it. The proletariat goes through various stages of development. At first the contest is carried on by individual labourers, then by the workpeople of a factory, then by the operative of one trade, in one locality, against the individual bourgeois who directly exploits them. They destroy imported wares that compete with their labour, they smash to pieces machinery, they set factories ablaze, they seek to restore by force the vanished status of the workman of the Middle Ages.
At this stage, the labourers still form an incoherent mass scattered over the whole country, and broken up by their mutual competition. If anywhere they unite to form more compact bodies, this is not yet the consequence of their own active union, but of the union of the bourgeoisie, which class, in order to attain its own political ends, is compelled to set the whole proletariat in motion, and is moreover yet, for a time, able to do so. At this stage, therefore, the proletarians do not fight their enemies, but the enemies of their enemies, the remnants of absolute monarchy, the landowners, the non-industrial bourgeois, the petty bourgeois. Thus, the whole historical movement is concentrated in the hands of the bourgeoisie; every victory so obtained is a victory for the bourgeoisie. I must not fear. Fear is the mind-killer. Fear is the little-death that brings total obliteration. I will face my fear. I will permit it to pass over me and through me. And when it has gone past I will turn the inner eye to see its path. Where the fear has gone there will be nothing. Only I will remain. But with the development of industry, the proletariat not only increases in number; it becomes concentrated in greater masses, its strength grows, and it feels that strength more. The various interests and conditions of life within the ranks of the proletariat are more and more equalised, in proportion as machinery obliterates all distinctions of labour, and nearly everywhere reduces wages to the same low level. The growing competition among the bourgeois, and the resulting commercial crises, make the wages of the workers ever more fluctuating. The increasing improvement of machinery, ever more rapidly developing, makes their livelihood more and more precarious; the collisions between individual workmen and individual bourgeois take more and more the character of collisions between two classes. 
Thereupon, the workers begin to form combinations (Trades’ Unions) against the bourgeois; they club together in order to keep up the rate of wages; they found permanent associations in order to make provision beforehand for these occasional revolts. Here and there, the contest breaks out into riots. `;

let mkv_item = new markov( {
    max: 160,
    order: 4,
    source: markov_dialog
} );

let mkv_sprite = new markov( {
    max: 260,
    order: 4,
    source: markov_dialog
} );

//window.mkv = mkv;