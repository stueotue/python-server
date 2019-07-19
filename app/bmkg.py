import requests
import xmltodict
import json


headers = {
"Accept": "application/json, text/plain, */*", 
"User-Agent": "Mozilla/5.0 (Linux; Android 4.4.2; LGM-V300K Build/N2G47H) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36", 
"Accept-Encoding": "gzip, deflate", 
"Accept-Language": "en-ID,en-US;q=0.8", 
"X-Requested-With": "com.Info_BMKG", 
"Connection": "close"} 

def dataGempa(url): 
    req = requests.get(url, headers=headers)
    jsonData = json.loads(json.dumps(xmltodict.parse(req.text)))
    return jsonData

def dataCuaca(url): # Sulawesi Utara 
    req = requests.get(url, headers=headers)
    jsonData = json.loads(json.dumps(xmltodict.parse(req.text)))
    return jsonData

def dataMaritim(url): # Perairan Bitung - Manado Only
    req = requests.get(url, headers=headers)
    jsonData = json.loads(json.dumps(xmltodict.parse(req.text)))
    return jsonData



