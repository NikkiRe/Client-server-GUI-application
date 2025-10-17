package org.web_4th_lab.web_4th_lab.rest;

import jakarta.ws.rs.core.Application;
import jakarta.ws.rs.ApplicationPath;
import org.web_4th_lab.web_4th_lab.resources.AuthorizationController;
import org.web_4th_lab.web_4th_lab.resources.PointCheckingController;

import java.util.HashSet;
import java.util.Set;

@ApplicationPath("/rest")
public class RestApplication extends Application {
    @Override
    public Set<Class<?>> getClasses() {
        Set<Class<?>> classes = new HashSet<>();
        classes.add(AuthorizationController.class);
        classes.add(PointCheckingController.class);
        return classes;
    }
}