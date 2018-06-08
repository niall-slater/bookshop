var tags = ["technology", "politics", "space", "nature", "business", "mindfulness", "history", "music", "gaming"];

var nounsTechnology = ["phone", "computer", "processor", "self-driving car", "drone", "climate solution", "coffee machine", "blockchain", "watch", "app", "cryptocurrency"];

var nounsPolitics = ["the ministry", "the chamber", "the referendum", "the election", "the filibuster", "brexit", "the expenses scandal", "the President"];

var nounsSpace = ["planet", "asteroid", "comet", "super-Earth", "exoplanet", "star", "nebula", "supernova", "galaxy", "black hole"];

var nounsNature = ["frog", "flower", "baboon", "parakeet", "bonobo", "whale", "starfish", "micro-organism", "fossil", "disease", "spider", "mollusc", "octopus"];

var nounsBusiness = ["startup", "bank", "service provider", "corporation", "SEO agency", "small-to-medium enterprise", "business"];

var nounsMindfulness = ["holistics", "the concept of hygge", "feng shui", "meditation", "yoga", "some mindfulness nonsense", "fingering pots of 'slime'", "looking at plants", "thinking", "light exercise", "self-acceptance", "personal growth"];

var nounsHistory = ["war", "Ancient Rome", "Ancient Greece", "Ancient Mesopotamia", "the Neolithic", "archaeology", "scrolls", "old stuff", "World War 2", "World War 1", "the Hundred Years' War", "a certain hip-hop musical", "the Civil War", "the War of the Roses", "colonialism", "the Mongol Empire", "a widely-discredited theory about immigration"];

var nounsMusic = ["band", "artist", "album", "single"];

var adjectivesMusic = ["hip-hop", "pop", "rock", "country", "shoegaze", "k-pop", "industrial metal", "grime", "smooth jazz", "regular jazz", "afrobeat", "scat", "Gregorian Chanting", "snugglecore"];

var nounsGaming = ["MMORPG", "Call of Duty", "argument about Half-Life 3", "video game distribution scandal", "crowdfunded gaming disaster", "Football Manager", "Battle Royale game", "shooter", "weird indie game", "Polygon article", "Twitch streamer racism scandal"];

function GenerateRandomNewsStory()
{
    var result = "";
    
    var numberOfFormats = 11;
    var formatSelect = Math.floor(Math.random() * (numberOfFormats));
    var tagSelect = Math.floor(Math.random() * (tags.length));
	
	var tag = tags[tagSelect];
    
    switch(tag) {
    case "technology":
        result = "Scientists have invented a new " + GetWord(nounsTechnology) + "!";
        break;
    case "politics":
        result = "People can't stop talking about what's happening with " + GetWord(nounsPolitics) + ".";
        break;
    case "space":
        result = "Did you hear? They discovered a new " + GetWord(nounsSpace) + "!";
        break;
    case "nature":
        result = "Scientists have found a previously undiscovered " + GetWord(nounsNature) + "!";
        break;
    case "business":
        result = "That famous guy won't stop tweeting about his new " + GetWord(nounsBusiness) + ".";
        break;
    case "mindfulness":
        result = "All my friends are talking about " + GetWord(nounsMindfulness) + ".";
        break;
    case "history":
        result = "There's a TV series on about " + GetWord(nounsHistory) + ".";
        break;
    case "music":
        result = "Apparently everyone loves that new " + GetWord(adjectivesMusic) + " " + GetWord(nounsMusic) + "!";
        break;
    case "gaming":
        result = "Have you heard about the latest " + GetWord(nounsGaming) + "?";
        break;
    default:
        result = "Brexit is going badly.";
        break;
    }
    
    return result;
}

function GetWord(wordType)
{
    var result = "";
    
    result = wordType[Math.floor(Math.random() * (1 + wordType.length - 1))];
    //result = toTitleCase(result);
    
    return result;
}