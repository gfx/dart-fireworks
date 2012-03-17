// a Dart port of http://jsdo.it/zarkswerk/fireworx

// Author: Fuji, Goro (gfx) <gfuji@cpan.org>
// LICENSE: The MIT License

#import('dart:html');

num random() {
  final num N = 3;
  num gen = 0.0;
  for(int i = 0; i < N; ++i) {
    gen += Math.random();
  }
  return gen / N;
}

String randomColor() {
  final List<int> rgb = new List<int>(3);
  for(int i = 0; i < rgb.length; ++i) {
    rgb[i] = (random() * 0xFF).toInt();
  }
  return "rgb(${rgb[0]},${rgb[1]},${rgb[2]})";
}

class Spark {
  static final num rad = Math.PI * 2;

  num posX;
  num posY;
  num velX;
  num velY;
  num size;
  bool sw;

  Spark(this.posX, this.posY, this.size) {
    num angle    = random() * rad;
    num velocity = random() * 5.0;

    velX = Math.cos(angle) * velocity;
    velY = Math.sin(angle) * velocity;
    sw = random() > 0.5;
  }

  void computeVelocity() {
    posX += velX;
    posY += velY;
  }

  void computeDecay(num d) {
    velX *= d;
    velY *= d;
    size *= d;
  }

  void computeGravity(num g) {
    posY += g;
  }

  void draw(CanvasRenderingContext2D cx, String color) {
    cx.beginPath();
    cx.arc(posX, posY, size, 0, rad, true);

    if(sw) {
      cx.fillStyle = "rgb(255, 255, 255)";
      sw = false;
    }
    else {
      cx.fillStyle = color;
      sw = true;
    }

    cx.fill();
  }
}

class Firework {
  static final num quantity  = 360;
  static final num size      = 2.0;
  static final num decay     = 0.98;
  static final num gravity   = 1.5;


  final String color;
  final List<Spark> sparks;

  Firework(int x, int y) : color = randomColor(), sparks = new List<Spark>() {
    for(int i = 0; i < quantity; ++i) {
      sparks.add(new Spark(x, y, size));
    }
  }

  void update(CanvasRenderingContext2D cx) {
    for(int i = 0; i < sparks.length; ++i) {
      Spark s = sparks[i];

      s.computeVelocity();
      s.computeDecay(decay);
      s.computeGravity(gravity);

      s.draw(cx, color);


      if(s.size <= 0.1 || s.posX <= 0 || s.posX >= 400 || s.posY >= 400) {
        sparks.removeRange(i, 1);
      }
    }
  }

  bool isDismissed() => sparks.isEmpty();
}

class FireworkView {
  CanvasRenderingContext2D cx;
  int width;
  int height;
  int left;
  int top;

  List<Firework> fireworks;

  FireworkView(CanvasElement canvas) : fireworks = new List<Firework>() {
    cx = canvas.getContext("2d");

    width  = canvas.width;
    height = canvas.height;
    canvas.rect.then((ElementRect rect) {
      left = rect.bounding.left;
      top  = rect.bounding.top;

      canvas.on.mouseDown.add( (MouseEvent e) {
        explode(e.clientX, e.clientY);
      });
      canvas.on.touchStart.add( (TouchEvent e) {
        explode(e.touches[0].pageX, e.touches[1].pageY);
      });
    });
  }

  void explode(int x, int y) {
    fireworks.add(new Firework(x - left, y - top));
  }

  void update() {
    if(fireworks.isEmpty()) return;

    for(int i = 0; i < fireworks.length; ++i) {
      Firework fw = fireworks[i];

      fw.update(cx);

      if(fw.isDismissed()) {
        fireworks.removeRange(i, 1);
      }
    }

    cx.fillStyle = "rgba(0, 0, 0, 0.3)";
    cx.fillRect(0, 0, width, height);
  }
}

class FPSWatcher {
  Stopwatch watch;
  int fps;

  FPSWatcher() {
    watch = new Stopwatch.start();
    fps   = 0;
  }

  void update() {
    ++fps;

    if(watch.elapsedInMs() >= 1000) {
      String message = "FPS: $fps";
      document.query('#fps').innerHTML = message;
      watch.reset();
      fps = 0;
    }
  }
}

void main() {
  CanvasElement canvas = document.query("#night-sky");

  FireworkView fm   = new FireworkView(canvas);
  FPSWatcher watcher = new FPSWatcher();

  window.setInterval(() {
    fm.update();
    watcher.update();
  }, 0);
}
