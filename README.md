# rmsp_check
To easy install this script, you should install Docker from oficial site https://docs.docker.com/
## Installation
1. `git clone https://github.com/kirill-ilichev/rmsp_check.git`
2. `cd rmsp_check`
3. `cd conf`
4. `sudo bash create_env.sh`
4. Make sure that you Docker is running
5. `sudo docker-compose build`
6. `sudo docker-compose run web python manage.py migrate`
7. `sudo docker-compose up`
8. open in your browser 127.0.0.1:8000
