package com.xiaojusurvey.engine.core.auth.captcha;

import com.xiaojusurvey.engine.common.entity.user.Captcha;
import org.springframework.stereotype.Service;

import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

/**
 * @Author: WYX
 * @CreateTime: 2025/8/10
 * @Description: 彩色字符+噪声svg验证码生成器
 */
@Service("svgCaptchaGenerator")
public class SvgCaptchaGenerator implements CaptchaGenerator {
    private static final int WIDTH = 150;
    private static final int HEIGHT = 50;
    private static final int SIZE = 4;                     // 对齐 size: 4
    private static final int NOISE = 3;                    // 对齐 noise: 3
    private static final String BG = "#f0f0f0";            // 对齐 background
    private static final String POOL = "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz"; // ignore 0o1i

    @Override
    public Captcha generateRandomText(int length) {
        ThreadLocalRandom rnd = ThreadLocalRandom.current();
        String text = IntStream.range(0, length)
                .mapToObj(i -> String.valueOf(POOL.charAt(rnd.nextInt(POOL.length()))))
                .collect(Collectors.joining());
        Captcha c = new Captcha();
        c.setText(text);
        return c;
    }

    @Override
    public String generateRandomSvg(String text) {
        ThreadLocalRandom rnd = ThreadLocalRandom.current();
        StringBuilder svg = new StringBuilder();
        svg.append("<svg xmlns='http://www.w3.org/2000/svg' width='")
                .append(WIDTH).append("' height='").append(HEIGHT)
                .append("' viewBox='0 0 ").append(WIDTH).append(" ").append(HEIGHT).append("'>");

        // background
        svg.append("<rect width='100%' height='100%' fill='").append(BG).append("'/>");

        // noise lines (cubic bezier), count = 3
        for (int i = 0; i < NOISE; i++) {
            svg.append("<path d='").append(randomCubicPath(rnd))
                    .append("' stroke='").append(randomVivid(rnd))
                    .append("' stroke-width='").append(rnd.nextInt(1, 3))
                    .append("' fill='none' opacity='0.85'/>");
        }

        // characters (color=true, each glyph random color)
        int fontSize = 28;
        int startX = 18;
        int gap = 30;
        for (int i = 0; i < text.length(); i++) {
            char ch = text.charAt(i);
            int x = startX + i * gap + rnd.nextInt(-2, 3);
            int y = HEIGHT / 2 + rnd.nextInt(-4, 5);
            int rotate = rnd.nextInt(-25, 26);
            int skew = rnd.nextInt(-10, 11);

            svg.append("<g transform='translate(").append(x).append(",").append(y)
                    .append(") rotate(").append(rotate).append(") skewX(").append(skew).append(")'>")
                    .append("<text x='0' y='0' dominant-baseline='middle' text-anchor='middle'")
                    .append(" font-family='Verdana,Arial' font-size='").append(fontSize).append("'")
                    .append(" fill='").append(randomVivid(rnd)).append("'>")
                    .append(ch)
                    .append("</text></g>");
        }

        svg.append("</svg>");
        return svg.toString();
    }

    private static String randomCubicPath(ThreadLocalRandom rnd) {
        // 模拟 svg-captcha 的随机贝塞尔干扰线
        int x1 = -10, y1 = rnd.nextInt(0, HEIGHT);
        int x2 = rnd.nextInt(0, WIDTH / 2), y2 = rnd.nextInt(0, HEIGHT);
        int x3 = rnd.nextInt(WIDTH / 2, WIDTH), y3 = rnd.nextInt(0, HEIGHT);
        int x4 = WIDTH + 10, y4 = rnd.nextInt(0, HEIGHT);
        return String.format("M %d %d C %d %d, %d %d, %d %d", x1, y1, x2, y2, x3, y3, x4, y4);
    }

    private static String randomVivid(ThreadLocalRandom rnd) {
        int h = rnd.nextInt(0, 360);
        int s = rnd.nextInt(70, 100);
        int l = rnd.nextInt(40, 65);
        return String.format("hsl(%d,%d%%,%d%%)", h, s, l);
    }

}
