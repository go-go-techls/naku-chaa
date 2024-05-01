#!/bin/bash
response=$(curl -X GET http://localhost:3000/api/results\?page\=1\&pageSize\=172)
# echo $response | jq -r '.data[].title' | while read title; do
#     echo "$title"
#     # ここで$imageに対する処理を行う
# done
echo $response | jq -r '.total'
# 重複しているタイトルのアイテムを抽出し、idとtitleを表示
echo "重複"
echo $response | jq -r 'reduce .data[] as $data ({}; .[$data.title] += [$data.id]) | to_entries | map(select(.value | length > 1)) | .[] | .value[] as $id | "\($id) | \(.key)"'
