package org.web_4th_lab.web_4th_lab.Utils;

import java.text.SimpleDateFormat;
import java.util.Calendar;

public class DateFormer {
    public String getCurrentDate(){
        return  new SimpleDateFormat("dd.MM.yyyy HH:mm:ss").format(Calendar.getInstance().getTime());
    }
}