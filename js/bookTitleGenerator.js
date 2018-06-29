var forenames = ["Barry", "Keith", "Susan", "Patricia", "Nigel", "Poppy", "Ellen", "Eleanor", "Samia", "Brad", "Joe", "Riz", "Gunther", "Hans", "Jolene"];
var surnames = ["Ahmed", "Trotter", "Harding", "Cornwell", "Smith", "Shaw", "Blount", "Shah", "Rosen", "Choudhury", "Tang", "Glau", "Blitz", "McCrum"];

var times = ["nanosecond", "second", "minute", "hour", "day", "days", "week", "fortnight", "year", "years", "decade", "lifetime", "bender", "spree", "rampage", "lunchtime", "breakfast", "midnight snack", "interstellar journey", "regrettable period"];

var nationalities = ["Irish", "Romanian", "German", "French", "Scottish", "English", "British", "Welsh", "Polish", "Russian", "Hungarian", "Canadian", "North American", "Australian", "Alien", "Foreign"];

//infinitives only
var verbs = ["catch", "study", "follow", "love", "build", "kiss", "smaench", "eat", "pat"];

var problems = ["Conundrum", "Case", "Affair", "Problem", "Referendum", "Decision", "Ultimatum", "Incident", "Resignation", "Discovery", "Rejection", "Cock-Up", "Disaster", "Campaign", "Murder", "Throwdown", "Betrayal"];

var adjectives = ["Engorged", "Slippery", "Fast", "Wanted", "Dangerous", "Heartbreaking", "Subversive", "Racist", "Nice", "Aromatic", "Broken", "Forgettable"];

var nouns_proper = ["Smaenching", "Plague", "Suffering", "Pleasure", "Food", "Stuff", "Complaining", "Torture", "Fun", "Bookselling", "Piling up Rocks", "Wasting Time", "Faffing About"];

var nouns_settings = ["Pocket", "Hole", "Fridge", "Field", "Pit", "Cave", "Sea"];

function generateTitleShort(interestTag)
{
    var result = "";
    
    var numberOfFormats = 4;
    var formatSelect = Math.floor(Math.random() * (numberOfFormats));
	
    switch(interestTag) {
    case 'technology':
		switch (formatSelect) {
			case 0: 
        		result = "Understanding " + getWord(nounsTechnology) + "s";
				break;
			case 1:
				result = getWord(nounsTechnology) + "s for Dummies";
				break;
			case 2:
				result = "Modding your " + getWord(nounsTechnology);
				break;
			case 3:
				result = "Most " + getWord(adjectives) + " " + getWord(nounsTechnology) + " of " + getRandomRecentYear();
				break;
		}
        break;
    case 'politics':
		switch (formatSelect) {
			case 0: 
        		result = getWord(problems) + " in the " + getWord(nounsPolitics);
				break;
			case 1:
				result = "The " + getWord(nounsPolitics) + " of " + getRandomRecentYear();
				break;
			case 2:
				result = "One " + getWord(adjectives) + " " + getWord(nounsPolitics);
				break;
			case 3:
				result = "To " + getWord(verbs) + " a " + getWord(nounsPolitics);
				break;
		}
        break;
    case 'space':
		switch (formatSelect) {
			case 0: 
				result = "The Science of a " + getWord(nounsSpace);
				break;
			case 1:
				result = "To " + getWord(verbs) + " a " + getWord(nounsSpace);
				break;
			case 2:
				result = getWord(verbs) + " Me in the " + getWord(nounsSpace);
				break;
			case 3:
				result = "Can You " + getWord(verbs) + " in Space?";
				break;
		}
        break;
    case 'nature':
		switch (formatSelect) {
			case 0: 
				result = "Great " + getWord(nounsNature) + " Photos";
				break;
			case 1:
				result = "The " + getWord(nationalities) + " " + getWord(nounsNature);
				break;
			case 2:
				result = "The " + getWord(nounsNature) + " that Could " + getWord(verbs);
				break;
			case 3:
				result = "Would You " + getWord(verbs) + " a " + getWord(nounsNature) + "?";
				break;
		}
        break;
    case 'business':
		switch (formatSelect) {
			case 0: 
				result = "Running a " + getWord(nounsBusiness);
				break;
			case 1:
				result = "Optimise your " + getWord(nounsBusiness);
				break;
			case 2:
				result = "The Great " + getWord(nationalities) + " " + getWord(nounsBusiness);
				break;
			case 3:
				result = getWord(nounsBusiness) + "s were more " + getWord(adjectives) + " in " + getRandomRecentYear();
				break;
		}
        break;
    case 'mindfulness':
		switch (formatSelect) {
			case 0: 
				result = "Save your " + getWord(nounsBusiness) + " with " + getWord(nounsMindfulness);
				break;
			case 1:
				result = "Basics of " + getWord(nounsMindfulness);
				break;
			case 2:
				result = "Be More " + getWord(adjectives) + " with Crystals";
				break;
			case 3:
				result = getWord(verbs) + " for " + getWord(nounsMindfulness);
				break;
		}
        break;
    case 'history':
		switch (formatSelect) {
			case 0: 
				result = getWord(nounsHistory) + " for Dummies";
				break;
			case 1:
				result = "Remembering " + getWord(nounsHistory);
				break;
			case 2:
				result = "Did People " + getWord(verbs) + " in " + getRandomOldYear() + "?";
				break;
			case 3:
				result = "A Complete History of " + getWord(nouns_proper);
				break;
		}
        break;
    case 'music':
		switch (formatSelect) {
			case 0: 
				result = getWord(adjectivesMusic) + " for Dummies";
				break;
			case 1:
				result = "A Life in " + getWord(adjectivesMusic);
				break;
			case 2:
				result = "Best of 70's " + getWord(adjectivesMusic);
				break;
			case 3:
				result = "Best of 80's " + getWord(adjectivesMusic);
				break;
		}
        break;
    case 'gaming':
		switch (formatSelect) {
			case 0: 
				result = "Secrets of " + getWord(nounsGaming);
				break;
			case 1:
				result = getWord(nounsGaming) + " Strategy Guide";
				break;
			case 2:
				result = "Get Better at " + getWord(nounsGaming);
				break;
			case 3:
				result = "Tales from a " + getWord(nounsGaming) + " Expert";
				break;
		}
        break;
    case 'fantasy':
		switch (formatSelect) {
			case 0: 
				result = "The " + getWord(nounsFantasy) + "'s " + getWord(nounsGeneric);
				break;
			case 1:
				result = "The " + getWord(nouns_settings) + " of " + getWord(nounsFantasy) + "s";
				break;
			case 2:
				result = "To " + getWord(verbs) + " a " + getWord(nounsFantasy);
				break;
			case 3:
				result = "Tales of a " + getWord(nounsFantasy);
				break;
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

function getRandomRecentYear() {
	let result = 2018 - 30 + Math.floor(Math.random() * 30);
	return result;
}

function getRandomOldYear() {
	let result = 1980 - 800 + Math.floor(Math.random() * 800);
	return result;
}