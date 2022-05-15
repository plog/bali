#!/usr/bin/env python

import googlemaps
import pprint
from datetime import datetime
import json
import geojson
from geojson import Feature, Point, FeatureCollection

gmaps = googlemaps.Client(key='AIzaSyBV0IgHDGxKknx7NHviTnv9Ld2UtM_mbnU')

def getGmap(cat,textquery,name,feature_collection,color):
    geocode_result = gmaps.find_place(textquery,'textquery')
    if geocode_result and 'candidates' in geocode_result:
        for res in geocode_result['candidates']:
            id = res['place_id']
            place = gmaps.place(id)
            print(id)
            place_url = place['result']['url']
            point = place['result']['geometry']['location']
            my_point = Point((point['lng'],point['lat']))
            property = {
                "name": name,
                "link":place_url,
                "category": cat,
                "popupContent":name,
                "color":color
            }
            my_feature = Feature(geometry=my_point,properties=property)
            feature_collection.append(my_feature)



i = 1
coll = None
with open('places.json') as data_file:    
    data = json.load(data_file)
    feature_collection = []
    for place_cat in data:
        # print(data[place_cat])
        for place in data[place_cat]:
            color = data[place_cat]['color']
            places = data[place_cat]['places']
            for place in places:
                print(place['search'])
                # print(place_cat,place['search'],place['name'],feature_collection,color)
                getGmap(place_cat,place['search'],place['name'],feature_collection,color)
            i+=1
    coll = FeatureCollection(feature_collection)
    print('--------------------------------')
    print(geojson.dumps(coll))

with open('features.geojson', 'w') as f:
    geojson.dump(coll,f)
f.close()

# place_url = ''
# place_name = 'Menjangan Island Bali'
# geocode_result = gmaps.find_place(place_name,'textquery')
# if geocode_result and 'candidates' in geocode_result:
#     for res in geocode_result['candidates']:
#         id = res['place_id']
#         place = gmaps.place(id)
#         pprint.pprint(place)
#         print(id)
#         place_url = place['result']['url']
#         pprint.pprint(place_url)

# # Geocoding an address
# geocode_result = gmaps.geocode('1600 Amphitheatre Parkway, Mountain View, CA')

# # Look up an address with reverse geocoding
# reverse_geocode_result = gmaps.reverse_geocode((40.714224, -73.961452))

# Request directions via public transit
# now = datetime.now()
# directions_result = gmaps.directions("Sydney Town Hall",
#                                      "Parramatta, NSW",
#                                      mode="transit",
#                                      departure_time=now)