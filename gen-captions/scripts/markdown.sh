#!/bin/bash
# total:
# response=$(curl -X GET http://localhost:3000/api/results\?page\=1\&pageSize\=40)
# response=$(curl -X GET http://localhost:3000/api/results\?page\=2\&pageSize\=40)
# response=$(curl -X GET http://localhost:3000/api/results\?page\=3\&pageSize\=40)
# curl -X GET http://localhost:3000/api/results\?page\=1\&pageSize\=200 >temp.json
# response=$(curl -X GET http://localhost:3000/api/results\?page\=4\&pageSize\=40)
# response=$(curl -X GET http://localhost:3000/api/results/27)
# response=$(curl -X GET http://localhost:3000/api/results\?page\=1\&pageSize\=160)
# echo $response | jq -r '.data[].title' | while read title; do
#     echo "$title"
#     # ここで$imageに対する処理を行う
# done
# echo $response | jq -r '.total'
# マークダウンファイルのヘッダを出力
echo "| id | image | title | feature | advantage | advice | rating | comment |"
echo "|----|-------|-------|---------|-----------|--------|--------|---------|"

# jqを使って各行をマークダウン形式で出力
jq -r '.data[] | "| \(.id) | ![Image](images/\(.id).jpeg) | \(.title | gsub("\n"; " ")) | \(.feature | gsub("\n"; " ")) | \(.advantage | gsub("\n"; " ")) | \(.advice | gsub("\n"; " ")) | \(.rating) | \(.comment | gsub("\n"; " ")) |"' temp.json
