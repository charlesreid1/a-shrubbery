import os
import json
import subprocess

json_file = 'fips.json'

def getStateCode(state):
    """
    Returns the FIPS code (as a string) for a state.

    FIPS codes are indexed by state abbreviations
    or state names, so you can use either of these:

    getStateCode('California')

    getStateCode('CA')

    """
    if not os.path.isfile(json_file):
        jsonifyStateCodes()

    with open(json_file,'r') as f:
        d = json.load(f)
    return d[state]



def jsonifyStateCodes():
    """
    Process state codes from census website
    http://www2.census.gov/geo/docs/reference/state.txt
    and store them in a JSON file.
    """
    subprocess.call(["curl","-O","http://www2.census.gov/geo/docs/reference/state.txt"])
    with open('state.txt','r') as f:
        contents = f.read()

    lines = contents.split('\n')

    stateCodes = {}
    keys = []
    for ii,line in enumerate(lines):
        # skip header, we know what we want
        if ii>0:
            tokens = line.split('|')

            # add FIPS code by state abbreviation AND state name
            try:
                state_abbrev = tokens[1]
                state_name = tokens[2]

                #statens = tokens[3]
                fips = tokens[0]

                # DONT FORGET THAT FIPS IS A STRING!!!

                stateCodes[state_abbrev] = fips
                stateCodes[state_name] = fips

                #print state_name + " : " + fips

            except IndexError:
                pass
    
    print "Finished parsing FIPS file. Dumping to "+json_file+"."

    with open(json_file,'w') as f:
        json.dump(stateCodes,f)


def test_codes():
    print "-"*40
    print "Testing out lookup capabilities..."
    print "CA fips code = " + getStateCode('CA') + " (should be 06)"
    print "NC fips code = " + getStateCode('NC') + " (should be 37)"
    print "TX fips code = " + getStateCode('TX') + " (should be 48)"

    print "California fips code = " +       getStateCode('California')      + " (should be 06)"
    print "North Carolina fips code = " +   getStateCode('North Carolina')  + " (should be 37)"
    print "Texas fips code = " +            getStateCode('Texas')           + " (should be 48)"
    print "-"*40


if __name__=="__main__":
    jsonifyStateCodes()
    test_codes()


