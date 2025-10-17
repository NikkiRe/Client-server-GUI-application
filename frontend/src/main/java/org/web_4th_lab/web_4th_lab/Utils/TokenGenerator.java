package org.web_4th_lab.web_4th_lab.Utils;

import java.util.UUID;

public class TokenGenerator {
    public String getNewToken(){
        return UUID.randomUUID().toString();
    }
}