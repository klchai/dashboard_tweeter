import pandas as pd
import json
# Lire fichier csv

filter=['user_name','text','date']

# id(int)
def search_by_id(df_tweets,id):
    id_data=df_tweets.loc[df_tweets['id']==id,filter]
    id_js=id_data.to_json(orient="index",force_ascii=False)
    return json.loads(id_js)

# print(search_by_id(1080003416573857792))
# user_id (int)
def search_by_uid(df_tweets,uid):
    uid_data=df_tweets.loc[df_tweets['user_id']==uid,filter]
    uid_js=uid_data.to_json(orient="index",force_ascii=False)
    return json.loads(uid_js)

# user_name (str)
def search_by_uname(df_tweets,uname):
    uname_data=df_tweets.loc[df_tweets['user_name']==uname,filter]
    uname_js=uname_data.to_json(orient="index",force_ascii=False)
    return json.loads(uname_js)

# texte (str)
def search_by_text(df_tweets,text):
    text_data=df_tweets.loc[df_tweets['text'].astype(str).str.contains(text),filter]
    text_js=text_data.to_json(orient="index",force_ascii=False)
    return text_js

# print(search_by_text("happy"))

# place name (str)
def search_by_place(df_tweets,place):
    place_data=df_tweets.loc[df_tweets['place_name']==place,filter]
    place_js=place_data.to_json(orient="index",force_ascii=False)
    return json.loads(place_js)

# print(search_by_place("Memphis, TN"))

# date au format AAAA-MM-JJ(str)
def search_by_date(df_tweets,date):
    date_data=df_tweets.loc[df_tweets['date']==date,filter]
    date_js=date_data.to_json(orient="index",force_ascii=False)
    return json.loads(date_js)

# time au format timestamp(int)
def search_by_time(df_tweets,time):
    time_data=df_tweets.loc[df_tweets['timestamp']==time,filter]
    time_js=time_data.to_json(orient="index",force_ascii=False)
    return json.loads(time_js)

def search_after_time(df_tweets,time):
    time_data=df_tweets.loc[df_tweets['timestamp']>time,filter]
    time_js=time_data.to_json(orient="index",force_ascii=False)
    return json.loads(time_js)

def search_before_time(df_tweets,time):
    time_data=df_tweets.loc[df_tweets['timestamp']<time,filter]
    time_js=time_data.to_json(orient="index",force_ascii=False)
    return json.loads(time_js)

# hashtag (str)
def search_by_hashtag(df_tweets,tag):
    if (tag != ""):
        hashtag_data=df_tweets.loc[(df_tweets['hashtag_0']==tag)|
                            (df_tweets['hashtag_1']==tag)|
                            (df_tweets['hashtag_2']==tag),filter]
    hash_js=hashtag_data.to_json(orient="index",force_ascii=False)
    return json.loads(hash_js)

def search_by_2hashtag(df_tweets,tag1, tag2):
    hash1_data=df_tweets.loc[(df_tweets['hashtag_0']==tag1)|
                  (df_tweets['hashtag_1']==tag1)|
                  (df_tweets['hashtag_2']==tag1),filter]
    hash2_data=df_tweets.loc[(df_tweets['hashtag_0']==tag2)|
                  (df_tweets['hashtag_1']==tag2)|
                  (df_tweets['hashtag_2']==tag2),filter]
    hash_data=pd.merge(hash1_data, hash2_data)
    hash_js=hash_data.to_json(orient="index",force_ascii=False)
    return json.loads(hash_js)

def search_by_3hashtag(df_tweets,tag1, tag2, tag3):
    hash1_data=df_tweets.loc[(df_tweets['hashtag_0']==tag1)|
                      (df_tweets['hashtag_1']==tag1)|
                      (df_tweets['hashtag_2']==tag1),filter]
    hash2_data=df_tweets.loc[(df_tweets['hashtag_0']==tag2)|
                      (df_tweets['hashtag_1']==tag2)|
                      (df_tweets['hashtag_2']==tag2),filter]
    hash3_data=df_tweets.loc[(df_tweets['hashtag_0']==tag3)|
                      (df_tweets['hashtag_1']==tag3)|
                      (df_tweets['hashtag_2']==tag3),filter]
    hash12_data=pd.merge(hash1_data, hash2_data)
    hash_data=pd.merge(hash12_data, hash3_data)
    hash_js=hash_data.to_json(orient="index",force_ascii=False)
    return json.loads(hash_js)

# print(search_by_3hashtag("IAmAPoet","MemphisPoetry","IAmAPoet901"))