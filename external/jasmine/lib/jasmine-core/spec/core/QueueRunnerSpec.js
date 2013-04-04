describe("QueueRunner", function() {

  it("runs all the functions it's passed", function() {
    var calls = [],
      fn1 = jasmine.createSpy('fn1'),
      fn2 = jasmine.createSpy('fn2'),
      queueRunner = new jasmine.QueueRunner({
        fns: [fn1, fn2]
      });
    fn1.andCallFake(function() {
      calls.push('fn1');
    });
    fn2.andCallFake(function() {
      calls.push('fn2');
    });

    queueRunner.execute();

    expect(calls).toEqual(['fn1', 'fn2']);
  });

  it("supports asynchronous functions, only advancing to next function after a done() callback", function() {
    //TODO: it would be nice if spy arity could match the fake, so we could do something like:
    //createSpy('asyncfn').andCallFake(function(done) {});

    var onComplete = originalJasmine.createSpy('onComplete'),
      beforeCallback = originalJasmine.createSpy('beforeCallback'),
      fnCallback = originalJasmine.createSpy('fnCallback'),
      afterCallback = originalJasmine.createSpy('afterCallback'),
      fn1 = function(done) {
        beforeCallback();
        setTimeout(function() {
          done()
        }, 100);
      },
      fn2 = function(done) {
        fnCallback();
        setTimeout(function() {
          done()
        }, 100);
      },
      fn3 = function(done) {
        afterCallback();
        setTimeout(function() {
          done()
        }, 100);
      },
      queueRunner = new jasmine.QueueRunner({
        fns: [fn1, fn2, fn3],
        onComplete: onComplete
      });

    clock.install();

    queueRunner.execute();

    expect(beforeCallback).toHaveBeenCalled();
    expect(fnCallback).not.toHaveBeenCalled();
    expect(afterCallback).not.toHaveBeenCalled();
    expect(onComplete).not.toHaveBeenCalled();

    clock.tick(100);

    expect(fnCallback).toHaveBeenCalled();
    expect(afterCallback).not.toHaveBeenCalled();
    expect(onComplete).not.toHaveBeenCalled();

    clock.tick(100);

    expect(afterCallback).toHaveBeenCalled();
    expect(onComplete).not.toHaveBeenCalled();

    clock.tick(100);

    expect(onComplete).toHaveBeenCalled();
  });

  it("calls an exception handler when an exception is thrown in a fn", function() {
    var fn = function() {
        throw new Error('fake error');
      },
      exceptionCallback = jasmine.createSpy('exception callback'),
      queueRunner = new jasmine.QueueRunner({
        fns: [fn],
        onException: exceptionCallback
      });

    queueRunner.execute();

    expect(exceptionCallback).toHaveBeenCalledWith(jasmine.any(Error));
  });

  it("rethrows an exception if told to", function() {
    var fn = function() {
        throw new Error('fake error');
      },
      queueRunner = new jasmine.QueueRunner({
        fns: [fn],
        catchException: function(e) { return false; }
      });

    expect(function() { queueRunner.execute(); }).toThrow();
  });

  it("calls a provided complete callback when done", function() {
    var fn = jasmine.createSpy('fn'),
      completeCallback = jasmine.createSpy('completeCallback'),
      queueRunner = new jasmine.QueueRunner({
        fns: [fn],
        onComplete: completeCallback
      });

    queueRunner.execute();

    expect(completeCallback).toHaveBeenCalled();
  });

  it("calls a provided garbage collection function with the complete callback when done", function() {
    var fn = jasmine.createSpy('fn'),
      completeCallback = jasmine.createSpy('completeCallback'),
      encourageGC = jasmine.createSpy('encourageGC'),
      queueRunner = new jasmine.QueueRunner({
        fns: [fn],
        encourageGC: encourageGC,
        onComplete: completeCallback
      });

    queueRunner.execute();

    expect(encourageGC).toHaveBeenCalledWith(completeCallback);
  });
});
