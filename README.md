# rmsp_check
## This script allows to check by INN or OGRN is subject small or medium-sized enterprise
To easy install this script, you should install Docker from oficial site https://docs.docker.com/
## Installation
1. `git clone https://github.com/kirill-ilichev/rmsp_check.git`
2. `cd rmsp_check`
3. `cd conf`
4. `sudo bash create_env.sh`
5. `cd ..`
6. Make sure that you Docker is running
7. `sudo docker-compose build`
8. `sudo docker-compose run web python manage.py migrate`
9. `sudo docker-compose up`
10. open in your browser 127.0.0.1:8000
