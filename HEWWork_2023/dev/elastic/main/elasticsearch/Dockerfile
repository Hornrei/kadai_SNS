FROM docker.elastic.co/elasticsearch/elasticsearch:7.16.2

ENV discovery.type=single-node

RUN elasticsearch-plugin install analysis-kuromoji
RUN elasticsearch-plugin install analysis-icu