#!/bin/bash

output=$(git pull 2>&1)
exit_code=$?

#git pull
if [ $exit_code -ne 0 ]; then
    echo "$output"
    exit 1
fi

#git commit
read -p "Enter Message : " message
if [[ -z "$message" ]]; then
    echo "[info] Commit message cannot be empty "
    exit 1
fi
git add . #track all the files
git commit -m "$message"


# Check upstream to ensure you are pushing to the right branch through automation

current_branch=$(git branch --show-current 2>&1)
echo " [info]----- Pushing  to the repo-----"
upstream_branch=$(git rev-parse --abbrev-ref --symbolic-full-name "${current_branch}@{upstream}" 2>/dev/null)
if [ -z "$upstream_branch" ]; then
  echo "No upstream branch set for $current_branch. Setting it to origin/$current_branch"
  git push --set-upstream origin "$current_branch"
else
  git push
fi


echo "[info] ======= Done Pushin ======="