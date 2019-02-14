package com.silveste;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Main {

    private static final Logger log = LoggerFactory.getLogger(Main.class);

    private static final String CONFIG_LOCATION = "beans.xml";

    public static void main(String[] args) {
        log.info("Guess The Number Game");

        // Create the context (container)
        ConfigurableApplicationContext context = new ClassPathXmlApplicationContext(CONFIG_LOCATION);

        // get number generator bean from context (container)
        //To instatiate a class, context.getBean needs the id of the class specified in CONFIG_LOCATION
        NumberGenerator numberGenerator = context.getBean("numberGenerator", NumberGenerator.class);

        //Call method next() to get a random number
        int number = numberGenerator.next();

        //log generated number
        //Curly braces are replaced by number due to internal configuration of slf4j
        log.info("number = {}", number);

        // get game bean from context (container)
        Game game = context.getBean(Game.class);

        //Call reset method
        game.reset();

        //Close context (container)
        context.close();
    }
}
