var forenames = ["Barry", "Keith", "Susan", "Patricia", "Nigel", "Poppy", "Ellen", "Eleanor", "Samia", "Brad", "Joe", "Riz", "Gunther", "Hans", "Jolene"];
var surnames = ["Ahmed", "Trotter", "Harding", "Cornwell", "Smith", "Shaw", "Blount", "Shah", "Rosen", "Choudhury", "Tang", "Glau", "Blitz", "McCrum"];

var times = ["nanosecond", "second", "minute", "hour", "day", "days", "week", "fortnight", "year", "years", "decade", "lifetime", "bender", "spree", "rampage", "lunchtime", "breakfast", "midnight snack", "interstellar journey", "regrettable period"];
var nationalities = ["Irish", "Romanian", "German", "French", "Scottish", "English", "British", "Welsh", "Polish", "Russian", "Hungarian", "Canadian", "North American", "Australian", "Alien", "Foreign"];


var problems = ["Conundrum", "Case", "Affair", "Problem", "Referendum", "Decision", "Ultimatum", "Incident", "Resignation", "Discovery", "Rejection", "Cock-Up", "Disaster", "Campaign", "Murder", "Throwdown"];


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
        	result = getWord(nounsSpace) + " of the " + getWord(nounsNature);
		} else {
			result = "Exploring the " + getWord(nounsSpace);
		}
        break;
    case 'nature':
		if (formatSelect > 5) {
        	result = "Anatomy of a " + getWord(nounsNature);
		} else {
			result = getWord(nationalities) + " " + getWord(nounsNature) + "s";
		}
        break;
    case 'business':
		if (formatSelect < 4) {
        	result = "Running a " + getWord(nounsBusiness);
		} else if (formatSelect < 7) {
			result = "Avoiding " + getWord(nounsBusiness) + " " + getWord(problems) + "s";
		} else {
			result = "Great " + getWord(nationalities) + " " + getWord(nounsBusiness);
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
        	result = "Examining the new " + getWord(nounsGaming);
		} else {
        	result = getWord(nounsGaming) + " Screenshots";
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
