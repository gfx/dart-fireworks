// a Dart port of http://jsdo.it/zarkswerk/fireworx

// Author: Fuji, Goro (gfx) <gfuji@cpan.org>
// LICENSE: The MIT License

#import('dart:html');

class Config {
  static final num quantity  = 1000;
  static final num size      = 2.0;
  static final num decay     = 0.98;
  static final num gravity   = 2.0;
  static final num speed     = 6.0;
}

class Random { // drand48
  static num x = 0;
  static num next() {
    x = x * 0x5DEECE66D + 0xB;
    x %= 0xFFFFFFFFFFFF;
    return x * (1.0/(0xFFFFFFFFFFFF+1));
  }
}
num random() => Math.random(); // Random.next();

String randomColor() {
  final List<int> rgb = new List<int>(3);
  for(int i = 0; i < rgb.length; ++i) {
    rgb[i] = (random() * 0xFF + 60).toInt();
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
  String color;
  int state = 0;

  Spark(this.posX, this.posY, this.size, this.color) {
    num angle    = random() * rad;
    num velocity = random() * Config.speed;

    velX = Math.cos(angle) * velocity;
    velY = Math.sin(angle) * velocity;
  }

  bool draw(FireworkView view) {
    posX += velX + (random() - 0.5);
    posY += velY + (random() - 0.5) + Config.gravity;

    velX *= Config.decay;
    velY *= Config.decay;
    size *= Config.decay;
    
    if(size < 0.5 && state == 0) {
      color = randomColor();
      size  = Config.size;
      ++state;
    }

    view.cx.beginPath();
    view.cx.arc(posX, posY, size, 0, rad, true);

    view.cx.fillStyle = random() > 0.2 ? color : "white";

    view.cx.fill();

    if(size <= 0.01) return false;
    if(posX <= 0) return false;
    if(posX >= view.width || posY >= view.height) return false;
    return true;
  }
}

class Firework {
  final List<Spark> sparks;

  final FireworkView view;

  Firework(this.view, int x, int y) : sparks = new List<Spark>() {
    
    String color = "lime";
    for(int i = 0; i < Config.quantity; ++i) {
      sparks.add(new Spark(x, y, Config.size, color));
    }
  }

  bool update() {
    for(int i = 0; i < sparks.length; ++i) {
      Spark s = sparks[i];

      if(! s.draw(view)) {
        sparks.removeRange(i, 1);
      }
    }
    return !sparks.isEmpty();
  }

}

class FireworkView {
  CanvasRenderingContext2D cx;
  int width;
  int height;
  int left;
  int top;

  List<Firework> fireworks;

  int numSparks = 0;

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

      // initial one
      explode((width / 2 + top).toInt(), (height / 3).toInt());
    });
  }

  void explode(int x, int y) {
    fireworks.add(new Firework(this, x - left, y - top));
  }

  void update() {
    if(fireworks.isEmpty()) return;

    numSparks = 0;

    for(int i = 0; i < fireworks.length; ++i) {
      Firework fw = fireworks[i];

      if(fw.update()) {
        numSparks += fw.sparks.length;
      }
      else {
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

  void update(int numSparks) {
    ++fps;

    if(watch.elapsedInMs() >= 1000) {
      String message = "FPS: $fps (sparks: $numSparks)";
      document.query('#fps').innerHTML = message;
      if(numSparks > 0) print(message);
      watch.reset();
      fps = 0;
    }
  }
}

void main() {
  CanvasElement canvas = document.query("#night-sky");

  FireworkView view  = new FireworkView(canvas);
  FPSWatcher watcher = new FPSWatcher();

  window.setInterval(() {
    view.update();
    watcher.update(view.numSparks);
  }, 0);
}
