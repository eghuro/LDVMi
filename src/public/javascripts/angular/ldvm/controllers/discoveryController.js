define(['angular', './controllers'], function (ng) {
    'use strict';

    return ng.module('ldvm.controllers')
        .controller('Discover', [
            '$scope', '$routeParams', 'Pipelines', '$connection',
            function ($scope, $routeParams, pipelines, $connection) {

                $scope.info = [];
                $scope.checks = [];
                $scope.portChecks = [];

                $scope.isFinished = false;
                $scope.lastPerformedIteration = 0;
                $scope.pipelinesDiscoveredCount = 0;
                $scope.duration = 0;

                $scope.data = [];

                var l = window.location;
                var isSsl = l.protocol === 'https:';
                var wsProtocol = isSsl ? "wss" : "ws";
                var uri = wsProtocol + "://" + l.host + "/api/v1/pipelines/discover";
                if ("dataSourceTemplateIds" in $routeParams && $routeParams.dataSourceTemplateIds) {

                    var ids = Array.isArray($routeParams.dataSourceTemplateIds) ? $routeParams.dataSourceTemplateIds : [$routeParams.dataSourceTemplateIds];
                    var params = ids.map(function (p) {
                        return "dataSourceTemplateIds=" + p;
                    });

                    uri += "?" + params.join("&");

                    if ($routeParams.combine && $routeParams.combine > 0) {
                        uri += "&combine=true";
                    }
                }
                var connection = $connection(uri);
                connection.listen(function () {
                    return true;
                }, function (data) {
                    $scope.$apply(function () {
                        $scope.info.unshift(data);

                        if ("isFinished" in data) {
                            $scope.isFinished = data.isFinished;
                            $scope.lastPerformedIteration = data.lastPerformedIteration;
                            $scope.isSuccess = data.isSuccess;
                            $scope.pipelinesDiscoveredCount = data.pipelinesDiscoveredCount;

                            if ("createdUtc" in data && "modifiedUtc" in data) {
                                $scope.duration = data.modifiedUtc - data.createdUtc;
                            }

                            if ("pipelinesDiscoveredCount" in data) {
                                $scope.data.push(data.pipelinesDiscoveredCount);
                            }

                            if (data.isFinished && data.isSuccess) {
                                var uri = "/pipelines#/list?quick=1&discoveryId=" + data.id;
                                if (parseInt($routeParams.lucky)) {
                                    uri += "&lucky=1";
                                }
                                window.location.href = uri;
                            }
                        }

                        if ("descriptor" in data) {
                            $scope.checks.unshift(data);
                        }

                        if ("portOwnerComponentUri" in data) {
                            $scope.portChecks.unshift(data);
                        }

                        $scope.info.splice(100);
                    });
                });
            }

        ]);
});
