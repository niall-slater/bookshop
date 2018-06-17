var forenames = ["Barry", "Keith", "Susan", "Patricia", "Nigel", "Poppy", "Ellen", "Eleanor", "Samia", "Brad", "Joe", "Riz", "Gunther", "Hans", "Jolene"];
var surnames = ["Ahmed", "Trotter", "Harding", "Cornwell", "Smith", "Shaw", "Blount", "Shah", "Rosen", "Choudhury", "Tang", "Glau", "Blitz", "McCrum"];

var times = ["nanosecond", "second", "minute", "hour", "day", "days", "week", "fortnight", "year", "years", "decade", "lifetime", "bender", "spree", "rampage", "lunchtime", "breakfast", "midnight snack", "interstellar journey", "regrettable period"];
var nationalities = ["Irish", "Romanian", "German", "French", "Scottish", "English", "British", "Welsh", "Polish", "Russian", "Hungarian", "Canadian", "North American", "Australian", "Alien", "Foreign"];

//infinitives only
var verbs = ["catch", "study", "follow", "love", "build", "kiss", "smaench", "eat", "pat"];

var problems = ["Conundrum", "Case", "Affair", "Problem", "Referendum", "Decision", "Ultimatum", "Incident", "Resignation", "Discovery", "Rejection", "Cock-Up", "Disaster", "Campaign", "Murder", "Throwdown", "Betrayal"];


function generateTitleShort(interestTag)
{
    var result = "";
    
    var numberOfFormats = 11;
    var formatSelect = Math.floor(Math.random() * (numberOfFormats));
	
    switch(interestTag) {
    case 'technology':
		if (formatSelect > 5) {
        	result = "Understanding " + getWord(nounsTechnology) + "s";
		} else {
			result = getWord(nounsTechnology) + "s for Dummies";
		}
        break;
    case 'politics':
		if (formatSelect > 5) {
        	result = getWord(problems) + " in the " + getWord(nounsPolitics);
		} else {
			result = "The " + getWord(nationalities) + " " + getWord(nounsPolitics);
		}
        break;
    case 'space':
		if (formatSelect > 5) {
        	result = "The Science of a " + getWord(nounsSpace);
		} else {
			result = "To " + getWord(verbs) + " a " + getWord(nounsSpace);
		}
        break;
    case 'nature':
		if (formatSelect > 5) {
        	result = "Great " + getWord(nounsNature) + " Photos";
		} else {
			result = "The " + getWord(nationalities) + " " + getWord(nounsNature);
		}
        break;
    case 'business':
		if (formatSelect < 4) {
        	result = "Running a " + getWord(nounsBusiness);
		} else if (formatSelect < 7) {
			result = "Optimise your " + getWord(nounsBusiness);
		} else {
			result = "The Great " + getWord(nationalities) + " " + getWord(nounsBusiness);
		}
        break;
    case 'mindfulness':
		if (formatSelect > 5) {
        	result = "Save your " + getWord(nounsBusiness) + " with " + getWord(nounsMindfulness);
		} else {
        	result = "Basics of " + getWord(nounsMindfulness);
		}
    case 'history':
		if (formatSelect > 5) {
        	result = getWord(nounsHistory) + " for Dummies";
		} else {
        	result = "Remembering " + getWord(nounsHistory);
		}
        break;
    case 'music':
		if (formatSelect > 5) {
        	result = "A Life in " + getWord(adjectivesMusic);
		} else {
        	result = "Best of 70's " + getWord(adjectivesMusic);
		}
        break;
    case 'gaming':
		if (formatSelect > 5) {
        	result = "Secrets of " + getWord(nounsGaming);
		} else {
        	result = getWord(nounsGaming) + " Strategy Guide";
		}
        break;
    case 'fantasy':
		if (formatSelect > 5) {
        	result = "The " + getWord(nounsFantasy) + "'s " + getWord(nounsGeneric);
		} else {
        	result = "The " + getWord(nounsPolitics) + " of " + getWord(nounsFantasy) + "s";
		}
        break;
    default:
        result = "The Second Death of Daedalus Mole";
        break;
    }
    
	result = toTitleCase(result);
	
    return result;
}

function getWord(wordType)
{
    var result = "";
    
    result = wordType[Math.floor(Math.random() * (1 + wordType.length - 1))];
    result = toTitleCase(result);
    
    return result;
}

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function generateName() {
	var result = "Nigey Nige";
	
	result = getWord(forenames) + " " + getWord(surnames);
	
	return result;
}
