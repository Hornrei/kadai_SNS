FROM confluentinc/cp-kafka-connect


ENV MYSQL_DRIVER_VERSION 5.1.39

# RUN curl -k -SL "https://dev.mysql.com/get/Downloads/Connector-J/mysql-connector-java-${MYSQL_DRIVER_VERSION}.tar.gz" \
#      | tar -xzf - -C /usr/share/confluent-hub-components/confluentinc-kafka-connect-jdbc/lib \
#      --strip-components=1 mysql-connector-java-5.1.39/mysql-connector-java-${MYSQL_DRIVER_VERSION}-bin.jar

RUN confluent-hub install confluentinc/kafka-connect-elasticsearch:latest --no-prompt
RUN confluent-hub install debezium/debezium-connector-mysql:latest --no-prompt
# RUN confluent-hub install confluentinc/kafka-connect-jdbc:10.7.4