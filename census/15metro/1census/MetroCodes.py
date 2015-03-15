import os
import simplejson as json
import subprocess
from collections import OrderedDict

json_file = 'metros.json'

def dumpMetroCodes():
    metroCodes = OrderedDict()


    metroCodes['New York']      = 35620
    metroCodes['Los Angeles']   = 31080
    metroCodes['Chicago']       = 16980
    metroCodes['Dallas']        = 19100
    metroCodes['Houston']       = 26420
    metroCodes['Philadelphia']  = 37980
    metroCodes['Washington DC'] = 47900
    metroCodes['Miami']         = 33100
    metroCodes['Atlanta']       = 12060
    metroCodes['Boston']        = 14460
    metroCodes['San Francisco'] = 41860
    metroCodes['Phoenix']       = 38060
    metroCodes['Riverside']     = 40140
    metroCodes['Detroit']       = 19820
    metroCodes['Seattle']       = 42660

    with open(json_file,'w') as f:
        json.dump(metroCodes,f)

    print "Finished with metro codes. Dumping to "+json_file+"."

if __name__=="__main__":
    dumpMetroCodes()
