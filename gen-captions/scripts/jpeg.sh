#!/bin/bash
# total:
# response=$(curl -X GET http://localhost:3000/api/results\?page\=1\&pageSize\=40)
# response=$(curl -X GET http://localhost:3000/api/results\?page\=2\&pageSize\=40)
# response=$(curl -X GET http://localhost:3000/api/results\?page\=3\&pageSize\=40)
# curl -X GET http://localhost:3000/api/results\?page\=4\&pageSize\=40 >temp.json
# response=$(curl -X GET http://localhost:3000/api/results\?page\=4\&pageSize\=40)
# response=$(curl -X GET http://localhost:3000/api/results/27)
# response=$(curl -X GET http://localhost:3000/api/results\?page\=1\&pageSize\=160)

curl -u "${BASIC_AUTH_USER}:${BASIC_AUTH_PASSWORD}" -X GET http://localhost:3000/api/arts\?page\=1\&pageSize\=165 >temp.json

# echo $response | jq -r '.data[].title' | while read title; do
#     echo "$title"
#     # ここで$imageに対する処理を行う
# done
# echo $response | jq -r '.total'
# echo $response | jq -r '.data[] | [.id, .title, .rating | tostring] | join("|")'
# cat temp.json

# jqコマンドでidとimageを抽出し、それぞれを読み込む
cat temp.json | jq -r '.data[] | "\(.id) \(.image)"' | while read -r id data_uri; do
    # Base64エンコードされた画像データをデコードし、ファイルに保存
    base64_str=$(echo "$data_uri" | sed 's/data:image\/jpeg;base64,//')
    echo -n "$base64_str" | base64 --decode >"images/${id}.jpeg"
done
