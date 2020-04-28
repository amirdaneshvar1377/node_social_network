import requests
from bs4 import BeautifulSoup
import json

MAIN_URI = 'http://fontsfree.net/'
page_count = 966
while (True):
    req_url = MAIN_URI + 'page/' + str(page_count)
    r = requests.get(req_url)
    if r.status_code == 404:
        break
    soup = BeautifulSoup(r.content, 'html.parser')
    find_a_list = soup.find_all(class_='btn btn-success btn-sm text-white')
    list_href = list()
    for i in find_a_list:
        href = i.get("href")
        list_href.append(href)    
    print(page_count)
    if page_count == 1:
        with open('data.json', 'w') as json_file:
            json_file.write(json.dumps(list_href))
    else:
        content = ''
        with open('data.json', 'r') as json_file:
            content = json.loads(json_file.read())

        with open('data.json', 'w') as json_file:
            content.append(list_href)
            json_file.write(json.dumps(content))

    list_href = list()
    page_count += 1

    