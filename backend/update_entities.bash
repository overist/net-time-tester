#!/bin/bash
# windows 환경에서는 git bash를 사용해야 함

# MEMO : 자동으로 프리티어가 적용되지 않으므로, 엔티티 파일에서 수동으로 Ctrl + S 실행해야 깃내역이 깔끔해집니다.
# MEMO : 실행 이후에 불필요한 엔티티 업데이트는 VSCODE 깃에서 변경내용 취소를 통해 삭제해주세요.

# typeorm-model-generator 실행
npx typeorm-model-generator -h localhost -d develop -p 4001 -u docker -x 'docker' -e mysql -o .

# 원본 파일들이 있는 디렉토리
src_dir="./entities"

# 수정된 파일들이 저장될 디렉토리
dst_dir="./src/entities"

# dst_dir 생성
mkdir -p $dst_dir

# dst_dir 디렉토리의 모든 파일 삭제
rm -rf $dst_dir/*

# entity 변경을 적용하기 위해 dist 삭제
rm -rf ./dist

# src_dir 디렉토리의 모든 .ts 파일을 처리
for file in $src_dir/*.ts; do
    # 파일을 수정하여 새 파일로 저장
    sed 's/Date | null/string | Date | null/g' $file > temp_file.ts
    
    # 새 파일 이름 생성
    new_file_name=$(basename $file .ts | sed -r 's/([a-z])([A-Z])/\1-\2/g' | tr '[:upper:]' '[:lower:]' | sed -r 's/([A-Z])([A-Z][a-z])/\1-\2/g')
    new_file_name="$dst_dir/$new_file_name.entity.ts"
    
    # 임시 파일을 새 파일 이름으로 이동
    mv temp_file.ts $new_file_name
done

npx prettier --write "$dst_dir/*.ts"

# source 리소스 삭제
rm -rf $src_dir
rm -rf ormconfig.json
