package com.trickynguci.civicmessagerbackend.service;

public interface RedisService {

    void setValue(String key, Object value);

    Object getValue(String key);

}
