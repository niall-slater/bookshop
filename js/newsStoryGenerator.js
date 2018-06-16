var tags = ["technology", "politics", "space", "nature", "business", "mindfulness", "history", "music", "gaming", "fantasy"];

var nounsTechnology = ["computer", "processor", "self-driving car", "drone", "machine", "blockchain", "laptop", "app", "cryptocurrency", "robot", "magnet", "dongle"];

var nounsPolitics = ["ministry", "chamber", "referendum", "filibuster", "campaign", "cabinet", "scandal", "presidency"];

var nounsSpace = ["planet", "meteor", "comet", "star", "nebula", "supernova", "galaxy", "black hole", "quasar", "moon"];

var nounsNature = ["frog", "flower", "baboon", "parakeet", "gorilla", "whale", "starfish", "spider", "mollusc", "dog", "cat"];

var nounsBusiness = ["startup", "bank", "bakery", "company", "shop", "law firm", "business"];

var nounsMindfulness = ["holistics", "hygge", "feng shui", "meditation", "yoga", "mindfulness", "looking at plants", "thinking", "exercise", "self-care"];

var nounsHistory = ["war", "Ancient Rome", "Ancient Greece", "Ancient Mesopotamia", "the Neolithic", "archaeology", "scrolls", "old stuff", "World War 2", "World War 1", "the Hundred Years' War", "a hip-hop musical", "the Civil War", "the War of the Roses", "colonialism", "the Mongol Empire", "wacky immigration theories"];

var nounsFantasy =["dragon", "giant spider", "wizard", "magic ring", "talking lion", "ghost", "vampire", "zombie", "spell", "curse", "hobbit"]

var nounsGeneric = ["friend", "town", "knife", "cake"]

var nounsMusic = ["band", "artist", "album", "single"];

var adjectivesMusic = ["hip-hop", "pop", "rock", "country", "shoegaze", "k-pop", "industrial metal", "grime", "smooth jazz", "jazz", "afrobeat", "scat", "Gregorian Chanting", "snugglecore", "yodeling"];

var nounsGaming = ["MMORPG", "Call of Duty", "Half-Life", "gaming scandal", "Football Manager", "PUBG knockoff", "shooter", "weird indie game", "SimCity"];

var nounsMedia = ["TV show", "movie", "film", "book", "thinkpiece", "blog", "webcomic", "play", "musical", "series"]

function GenerateRandomNewsStory()
{
    var result = {
		tag: undefined,
		text: ""
	};
    
    var numberOfFormats = 11;
    var formatSelect = Math.floor(Math.random() * (numberOfFormats));
    var tagSelect = Math.floor(Math.random() * (tags.length));
	
	var tag = tags[tagSelect];
	
	result.tag = tag;
    
    switch(tag) {
    case "technology":
        result.text = "Scientists have invented a new " + getWord(nounsTechnology) + "!";
        break;
    case "politics":
        result.text = "People can't stop talking about what's happening with the " + getWord(nounsPolitics) + ".";
        break;
    case "space":
        result.text = "Did you hear? They discovered a new " + getWord(nounsSpace) + "!";
        break;
    case "nature":
        result.text = "Scientists have found a previously undiscovered " + getWord(nounsNature) + "!";
        break;
    case "business":
        result.text = "That famous guy won't stop tweeting about his new " + getWord(nounsBusiness) + ".";
        break;
    case "mindfulness":
        result.text = "All my friends are talking about " + getWord(nounsMindfulness) + ".";
        break;
    case "history":
        result.text = "There's a new " + getWord(nounsMedia) + " about " + getWord(nounsHistory) + ".";
        break;
    case "music":
        result.text = "Apparently everyone loves that new " + getWord(adjectivesMusic) + " " + getWord(nounsMusic) + "!";
        break;
    case "gaming":
        result.text = "Have you heard about the latest " + getWord(nounsGaming) + "?";
        break;
    case "fantasy":
        result.text = "Everyone's nuts for that new " + getWord(nounsMedia) + " about " + getWord(nounsFantasy) + "s.";
        break;
    default:
        result.text = "Brexit is going badly.";
        break;
    }
    
    return result;
}

function pickRandomTag(){
	let result = tags[Math.floor(Math.random()*tags.length)];
	return result;
}