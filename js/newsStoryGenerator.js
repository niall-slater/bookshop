var tags = ["technology", "politics", "space", "nature", "business", "mindfulness", "history", "music", "gaming"];

var nounsTechnology = ["phone", "computer", "processor", "self-driving car", "drone", "climate solution", "coffee machine", "blockchain", "watch", "app", "cryptocurrency"];

var nounsPolitics = ["ministry", "chamber", "referendum", "election", "filibuster", "brexit", "campaign", "cabinet", "expenses scandal", "oval office"];

var nounsSpace = ["planet", "asteroid", "comet", "super-Earth", "exoplanet", "star", "nebula", "supernova", "galaxy", "black hole"];

var nounsNature = ["frog", "flower", "baboon", "parakeet", "bonobo", "whale", "starfish", "micro-organism", "fossil", "disease", "spider", "mollusc", "aquatic monster"];

var nounsBusiness = ["startup", "bank", "service provider", "corporation", "SEO agency", "enterprise", "business"];

var nounsMindfulness = ["holistics", "the concept of hygge", "feng shui", "meditation", "yoga", "mindfulness", "fidget spinning", "looking at plants", "thinking", "light exercise", "self-acceptance", "personal growth"];

var nounsHistory = ["war", "Ancient Rome", "Ancient Greece", "Ancient Mesopotamia", "the Neolithic", "archaeology", "scrolls", "old stuff", "World War 2", "World War 1", "the Hundred Years' War", "a hip-hop musical", "the Civil War", "the War of the Roses", "colonialism", "the Mongol Empire", "wacky immigration theories"];

var nounsMusic = ["band", "artist", "album", "single"];

var adjectivesMusic = ["hip-hop", "pop", "rock", "country", "shoegaze", "k-pop", "industrial metal", "grime", "smooth jazz", "jazz", "afrobeat", "scat", "Gregorian Chanting", "snugglecore"];

var nounsGaming = ["MMORPG", "Call of Duty", "Half-Life", "gaming scandal", "crowdfunded scandal", "Football Manager", "PUBG knockoff", "shooter", "weird indie game", "Polygon article", "streamer scandal"];

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
        result.text = "There's a TV series on about " + getWord(nounsHistory) + ".";
        break;
    case "music":
        result.text = "Apparently everyone loves that new " + getWord(adjectivesMusic) + " " + getWord(nounsMusic) + "!";
        break;
    case "gaming":
        result.text = "Have you heard about the latest " + getWord(nounsGaming) + "?";
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